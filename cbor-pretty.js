var _ = require("lodash");

module.exports = cborPrettyPrint;
cborPrettyPrint.walkCbor = walkCbor;

const CBOR_MAJOR = {
	UNSIGNED_INT: 0x00,
	NEGATIVE_INT: 0x20,
	BYTE_STRING: 0x40,
	TEXT_STRING: 0x60,
	ARRAY: 0x80,
	MAP: 0xa0,
	SEMANTIC_TAG: 0xc0,
	VALUE: 0xe0
};

const CBOR_MASK = {
	MAJOR: 0xE0,
	LENGTH: 0x1F,
};

const CBOR_LENGTH = {
	ONE: 0x18,
	TWO: 0x19,
	THREE: 0x1A,
	INDEFINITE: 0x1F
};

function cborPrettyPrint(cbor, options) {
	var defaultOptions = {
		indent: 2,
		hexSpace: true,
		hexWrap: 8,
		hexSyntax: false,
		comment: "//",
		commentColumn: 60,
		output: process.stdout
	};
	if (options === undefined) options = {};
	options = _.assignIn(defaultOptions, options);

	var cborTree = walkCbor(cbor, options).value;
	printCbor(cborTree, options.output, options); // TDDO: remove output paramater, and just use options
}

// options:
// 	 context
//   callback
function walkCbor(cbor, options) {
	// console.log (cbor);
	var ret, len, i, offset, key, value;
	switch (cbor[0] & CBOR_MASK.MAJOR) {

		case CBOR_MAJOR.MAP:
			ret = getCborLength(cbor);

			// parse the members of the map
			value = {
				type: "map",
				value: [],
				length: ret.length,
				bytes: cbor.slice(0, ret.bytes)
			};
			cbor = walkChildren(cbor, ret.bytes, ret.length * 2, options, function(v) {
				if (key === undefined) {
					key = v;
				} else {
					value.value.push({
						key: key,
						value: v
					});
					key = undefined;
				}
			});

			// console.log (require("util").inspect(value,{depth:null}));
			return {
				value: value,
				cbor: cbor
			};

		case CBOR_MAJOR.UNSIGNED_INT:
			return {
				value: {
					type: "int",
					value: cbor[0]
				},
				cbor: cbor.slice(1)
			};

		case CBOR_MAJOR.BYTE_STRING:
			ret = getCborLength(cbor);
			return {
				cbor: cbor.slice(ret.bytes + ret.length),
				value: {
					type: "byte",
					length: ret.length,
					value: cbor.slice(ret.bytes, ret.bytes + ret.length),
					bytes: cbor.slice(0, ret.bytes)
				}
			};

		case CBOR_MAJOR.TEXT_STRING:
			ret = getCborLength(cbor);
			return {
				cbor: cbor.slice(ret.bytes + ret.length),
				value: {
					type: "text",
					length: ret.length,
					value: cbor.slice(ret.bytes, ret.bytes + ret.length),
					bytes: cbor.slice(0, ret.bytes)
				}
			};

		case CBOR_MAJOR.ARRAY:
			ret = getCborLength(cbor);

			// parse members of the list
			value = {
				type: "list",
				value: [],
				length: ret.length,
				bytes: cbor.slice(0, ret.bytes)
			};
			cbor = walkChildren(cbor, ret.bytes, ret.length, options, function(v) {
				value.value.push(v);
			});

			return {
				cbor: cbor,
				value: value
			};

		case CBOR_MAJOR.NEGATIVE_INT:
		case CBOR_MAJOR.SEMANTIC_TAG:
		case CBOR_MAJOR.VALUE:
			/* falls through */
		default:
			console.log("not supported");
	}
}

function getCborLength(cbor) {
	var len = cbor[0] & CBOR_MASK.LENGTH;
	if (len < CBOR_LENGTH.ONE) return {
		length: len,
		bytes: 1
	};
	switch (len) {
		case CBOR_LENGTH.ONE:
			return {
				length: cbor[1],
				bytes: 2
			};
		case CBOR_LENGTH.TWO:
			return {
				length: cbor[1] << 8 | cbor[2],
				bytes: 3
			};
		case CBOR_LENGTH.THREE:
			return {
				length: cbor[1] << 16 | cbor[1] << 8 | cbor[3],
				bytes: 4
			};
		case CBOR_LENGTH.INDEFINITE:
			/* falls through */
		default:
			console.log("bad length in getCborLength");
	}
}


function walkChildren(cbor, offset, len, options, cb) {
	var i, ret;

	for (i = 0; i < len; i++) {
		ret = walkCbor(cbor.slice(offset), options);
		cb(ret.value);
		cbor = ret.cbor;
		offset = 0;
	}

	return cbor;
}

var indent = -1;

function printCbor(node, output, options) {
	var hex;
	// console.log (node);
	indent++;
	printIndent(indent, output, options);
	switch (node.type) {
		case "map":
			printArray(node.bytes, "map(" + node.length + ")", output, options);
			printChildren(node.value, output, options);
			break;
		case "int":
			writeOutput(output, i2h(node.value, options) + "integer " + node.value);
			break;
		case "list":
			printArray(node.bytes, "list(" + node.length + ")", output, options);
			printChildren(node.value, output, options);
			break;
		case "text":
			printArray(node.bytes, "text(" + node.length + ")", output, options);
			indent++;
			printIndent(indent, output, options);
			printArray(node.value, "\"" + arrToStr(node.value) + "\"", output, options);
			indent--;
			break;
		case "byte":
			printArray(node.value, "byte(" + node.length + ")", output, options);
			indent++;
			printIndent(indent, output, options);
			printArray(node.value, null, output, options);
			indent--;
			break;
		default:
			console.log("type not found: ", node.type);
	}
	indent--;
}

function i2h(int, options) {
	var h = int.toString(16);
	if (h.length === 1) h = "0" + h;
	if (options.hexSyntax) h = "0x" + h + ",";
	if (options.hexSpace) h = h + " ";
	return h;
}

function arrToStr(arr, options) {
	var str = "",
		i;
	for (i = 0; i < arr.length; i++) {
		str += String.fromCharCode(arr[i]);
	}
	return str;
}

function printIndent(indent, output, options) {
	var i, str = "";
	for (i = 0; i < indent * options.indent; i++) {
		str += " ";
	}
	writeOutput(output, str);
}

function printArray(arr, comment, output, options) {
	var i;
	for (i = 0; i < arr.length; i++) {
		if (options.hexWrap &&
			i &&
			(i % options.hexWrap) === 0) {
			printComment(comment, output, options);
			printIndent(indent, output, options);
			comment = null;
		}
		writeOutput(output, i2h(arr[i], options));
	}
	printComment(comment, output, options);
}

function printChildren(arr, output, options) {
	var i;
	for (i = 0; i < arr.length; i++) {
		if (arr[i].key !== undefined) {
			printCbor(arr[i].key, output, options);
			printCbor(arr[i].value, output, options);
		} else {
			printCbor(arr[i], output, options);
		}
	}
}

var writeCount = 0;
function writeOutput (output, str) {
	writeCount += str.length;
	output.write (str);
}

function printComment(str, output, options) {
	var i;
	if (str === null) {
		str = "...";
	}

	var spacing = " ";
	for (i = 0; i < (options.commentColumn - writeCount - 1); i++) {
		spacing += " ";
	}
	writeOutput(output, spacing + options.comment + " " + str + "\n");
	writeCount = 0;
}