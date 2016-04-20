# cbor-pretty-print
Parses and prints CBOR (RFC 7049)

## Install
`npm install https://github.com/apowers313/cbor-pretty-print`

## Command Line
`cborprint file.json` -- converts `file.json` to CBOR and then prints it out

## API
``` js
var cp = require ("cbor-pretty-print");
cp (cbor); // prints cbor
cp (cbor, options); // prints cbor with options

var options = {
    indent: 2,              // number of spaces to indent each level
    hexSpace: true,         // put a space between hex numbers e.g. - "FF 00" instead of "FF00"
    hexWrap: 8,             // number of hex characters to print before line wrapping
    hexSyntax: false,       // make hex syntactically correct to be cut-and-paste ready: "0xFF, "
    comment: "//",          // string to use for comments
    output: process.stdout  // output stream
};
```