#!/usr/bin/env node

var program = require ("commander");
var CBOR = require ("cbor-js");
var cpp = require ("./cbor-pretty");

program
	.version("0.0.1")
	.description("Converts JSON to CBOR and prints it out")
	.option("-i, --indent <spaces>", "number of spaces for each indent level")
	.option("-s, --space-hex", "whether or not to put a space between hex bytes (e.g. - 'FF 00' or 'FF00'")
	.option("-w, --wrap-hex <bytes>", "wrap hex lines after <bytes>")
	.option("-x, --syntax", "print out hex syntax in a ready to cut and paste way (e.g. - '0xFF,'")
	.option("-c, --comment <string>", "string to use for comments (e.g. - '//' or '#'")
	.option("-m, --comment-column <num>", "what column the comments should be aligned to")
	.usage("[options] <file>")
	.parse(process.argv);


if (program.args.length === 0) program.help();

var options = {};
if (program.indent) options.indent = program.indent;
if (program.spacehex) options.hexSpace = program.spacehex;
if (program.hexWrap) options.hexWrap = program.hexWrap;
if (program.syntax) options.hexSyntax = program.syntax;
if (program.comment) options.comment = program.comment;
if (program.commentColumn) options.commentColumn = program.commentColumn;

var i;
for (i = 0; i < program.args.length; i++) {
	var filename = program.args[i];
	if (filename[0] !== "/" && filename[0] !== ".") filename = "./" + filename;
	console.log ("Reading JSON file: " + filename + " ...");
	var file = require (filename);
	var cbor = new Uint8Array (CBOR.encode (file));
	cpp (cbor, options);
}