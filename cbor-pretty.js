module.exports = cborPrettyPrint;
cborPrettyPrint.walkCbor = walkCbor;
cborPrettyPrint.printCbor = printCbor;

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

function cborPrettyPrint (cbor, output) {
	if (output === undefined) output = process.stdout;
	console.log ("cborPrettyPrint");
	var cborTree = walkCbor (cbor).value;
	printCbor (cborTree);
}

// options:
// 	 context
//   callback
function walkCbor (cbor, options) {
	// console.log (cbor);
	var ret, len, i, offset, key, value;
	switch (cbor[0] & CBOR_MASK.MAJOR) {

		case CBOR_MAJOR.MAP:
			ret = getCborLength(cbor);

			// parse the members of the map
			value = { type: "map", value: [], length: ret.length};
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
					value: cbor.slice(ret.bytes, ret.bytes + ret.length)
				}
			};

		case CBOR_MAJOR.TEXT_STRING:
			ret = getCborLength(cbor);
			return {
				cbor: cbor.slice(ret.bytes + ret.length),
				value: {
					type: "text",
					length: ret.length,
					value: cbor.slice(ret.bytes, ret.bytes + ret.length)
				}
			};

		case CBOR_MAJOR.ARRAY:
			ret = getCborLength(cbor);

			// parse members of the list
			value = { type: "list", value: [], length: ret.length};
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
			console.log ("not supported");
	}
}

function getCborLength (cbor) {
	var len = cbor[0] & CBOR_MASK.LENGTH;
	if (len < CBOR_LENGTH.ONE) return { length: len, bytes: 1 };
	switch (len) {
		case CBOR_LENGTH.ONE:
			return { length: cbor[1], bytes: 2 };
		case CBOR_LENGTH.TWO:
			return { length: cbor[1] << 8 | cbor[2], bytes: 3 };
		case CBOR_LENGTH.THREE:
			return { length: cbor[1] << 16 | cbor[1] << 8 | cbor[3], bytes: 4};
		case CBOR_LENGTH.INDEFINITE:
			/* falls through */
		default:
			console.log ("bad length in getCborLength");
	}
}


function walkChildren (cbor, offset, len, options, cb) {
	var i, ret;

	for (i = 0; i < len; i++) {
		ret = walkCbor (cbor.slice(offset), options);
		cb (ret.value);
		cbor = ret.cbor;
		offset = 0;
	}

	return cbor;
}

function printCbor (cborTree, output) {

}