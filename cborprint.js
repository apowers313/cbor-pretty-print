var program = require ("commander");
var CBOR = require ("cbor-js");
var cpp = require ("./cbor-pretty");

program
	.version("0.0.1")
	.description("Converts JSON to CBOR and prints it out")
	.usage("[options] <file>")
	.parse(process.argv);

var i;
for (i = 0; i < program.args.length; i++) {
	var filename = program.args[i];
	console.log ("Reading JSON file: " + filename + " ...");
	var file = require (filename);
	var cbor = new Uint8Array (CBOR.encode (file));
	cpp (cbor);
}