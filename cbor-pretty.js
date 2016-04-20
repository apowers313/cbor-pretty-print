module.exports = cborPrettyPrint;

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
	var cborTree = walkCbor (cbor);
	printCbor (cborTree);
}
// options:
// 	 context
//   callback
function walkCbor (cbor, options) {
	var retLen;
	switch (cbor[0] & CBOR_MASK.MAJOR) {
		case CBOR_MAJOR.MAP:
			console.log ("map");
			retLen = getCborLength(cbor);
			console.log ("nelem:", retLen);
			break;
		case CBOR_MAJOR.UNSIGNED_INT:
		case CBOR_MAJOR.NEGATIVE_INT: 
		case CBOR_MAJOR.BYTE_STRING:
		case CBOR_MAJOR.TEXT_STRING:
		case CBOR_MAJOR.ARRAY:
		case CBOR_MAJOR.SEMANTIC_TAG:
		case CBOR_MAJOR.VALUE:
			/* falls through */
		default:
			console.log ("not supported");
	}
}

function getCborLength (cbor) {
	var len = cbor[0] & CBOR_MASK.LENGTH;
	console.log ("initial length:", len);
	if (len < CBOR_LENGTH) return { length: len, bytes: 1 };
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

function printCbor (cborTree, output) {

}