var cpp = require ("../cbor-pretty.js");

var helpers = {
	simpleMap: [ 0xa4, 0x01, 0x02, 0x03, 0x04 ]
};

describe ("basic testing", function() {
	var outputStream;
	beforeEach(function() {
		// outputStream = 
	});
	it ("parses a cbor map", function() {
		cpp(helpers.simpleMap);
	});
	it ("parses a cbor int");
	it ("parses a cbor array");
	it ("parses a cbor string");
	it ("parses a cbor byte array");
	it ("can space characters");
	it ("has correct indentations");
});