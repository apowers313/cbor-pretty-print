var assert = require("chai").assert;
var cpp = require("../cbor-pretty.js");

var helpers = {
	simpleMap: [0xa2, 0x01, 0x02, 0x03, 0x04],
	simpleText: [0x6a, 0x70, 0x61, 0x79, 0x70, 0x61, 0x6c, 0x2e, 0x63, 0x6f, 0x6d],
	simpleBytes: [0x4a, 0x70, 0x61, 0x79, 0x70, 0x61, 0x6c, 0x2e, 0x63, 0x6f, 0x6d],
	arrayOfMapOfText: [0x82, 0xa2, 0x64, 0x74, 0x79, 0x70, 0x65, 0x64, 0x46, 0x49, 0x44, 0x4f, 0x69, 0x61, 0x6c, 0x67, 0x6f, 0x72, 0x69, 0x74, 0x68, 0x6d, 0x65, 0x45, 0x53, 0x32, 0x35, 0x36, 0xa2, 0x64, 0x74, 0x79, 0x70, 0x65, 0x64, 0x46, 0x49, 0x44, 0x4f, 0x69, 0x61, 0x6c, 0x67, 0x6f, 0x72, 0x69, 0x74, 0x68, 0x6d, 0x65, 0x52, 0x53, 0x32, 0x35, 0x36],
};

describe("basic testing", function() {
	var outputStream;
	beforeEach(function() {
		// outputStream = 
	});

	it("parses a simple cbor map", function() {
		var r = cpp.walkCbor(helpers.simpleMap);
		// console.log(require("util").inspect(r, {
		// 	depth: null
		// }));
		assert.deepEqual(r, {
			cbor: [],
			value: {
				type: 'map',
				length: 2,
				value: [{
					key: {
						type: 'int',
						value: 1
					},
					value: {
						type: 'int',
						value: 2
					}
				}, {
					key: {
						type: 'int',
						value: 3
					},
					value: {
						type: 'int',
						value: 4
					}
				}]
			}
		});
	});

	it("parses a simple cbor text", function() {
		var r = cpp.walkCbor(helpers.simpleText);
		assert.deepEqual(r, {
			cbor: [],
			value: {
				type: 'text',
				length: 10,
				value: [112, 97, 121, 112, 97, 108, 46, 99, 111, 109]
			}
		});
	});

	it("parses a simple cbor byte array", function() {
		var r = cpp.walkCbor(helpers.simpleBytes);
		assert.deepEqual(r, {
			cbor: [],
			value: {
				type: 'byte',
				length: 10,
				value: [112, 97, 121, 112, 97, 108, 46, 99, 111, 109]
			}
		});
	});

	it("parses a cbor array", function() {
		var r = cpp.walkCbor(helpers.arrayOfMapOfText);
		assert.deepEqual(r, {
			cbor: [],
			value: {
				type: 'list',
				value: [{
					type: 'map',
					value: [{
						key: {
							type: 'text',
							length: 4,
							value: [116, 121, 112, 101]
						},
						value: {
							type: 'text',
							length: 4,
							value: [70, 73, 68, 79]
						}
					}, {
						key: {
							type: 'text',
							length: 9,
							value: [97, 108, 103, 111, 114, 105, 116, 104, 109]
						},
						value: {
							type: 'text',
							length: 5,
							value: [69, 83, 50, 53, 54]
						}
					}],
					length: 2
				}, {
					type: 'map',
					value: [{
						key: {
							type: 'text',
							length: 4,
							value: [116, 121, 112, 101]
						},
						value: {
							type: 'text',
							length: 4,
							value: [70, 73, 68, 79]
						}
					}, {
						key: {
							type: 'text',
							length: 9,
							value: [97, 108, 103, 111, 114, 105, 116, 104, 109]
						},
						value: {
							type: 'text',
							length: 5,
							value: [82, 83, 50, 53, 54]
						}
					}],
					length: 2
				}],
				length: 2
			}
		});
	});

	it("parses a cbor int");
	it("can space characters");
	it("has correct indentations");
});