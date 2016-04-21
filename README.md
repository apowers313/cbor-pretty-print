# cbor-pretty-print
Parses and prints CBOR (RFC 7049)

NOTE: the CBOR parser is currently incomplete and only handles the most likely use cases: maps, byte / text strings, lists and integers. It does not handle floats, indefinite length items, negative numbers, or other types that are less frequently used. Pull requests or GitHub issues are always welcome.

## Install
For API usage:
`npm install https://github.com/apowers313/cbor-pretty-print`

For command line usage:
`npm install -g https://github.com/apowers313/cbor-pretty-print`

## Command Line
`cborprint file.json` -- converts `file.json` to CBOR and then prints it out

``` 
  Usage: cborprint [options] <file>

  Converts JSON to CBOR and prints it out

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -i, --indent <spaces>   number of spaces for each indent level
    -s, --space-hex         whether or not to put a space between hex bytes (e.g. - 'FF 00' or 'FF00'
    -w, --wrap-hex <bytes>  wrap hex lines after <bytes>
    -x, --syntax            print out hex syntax in a ready to cut and paste way (e.g. - '0xFF,'
    -c, --comment <string>  string to use for comments (e.g. - '//' or '#'
```

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

## Output
If things go well, here's what the output should look like:
```
82                                      // list(2)
  a2                                    // map(2)
    64                                  // text(4)
      74 79 70 65                       // "type"
    64                                  // text(4)
      46 49 44 4f                       // "FIDO"
    69                                  // text(9)
      61 6c 67 6f 72 69 74 68           // "algorithm"
      6d                                // ...
    65                                  // text(5)
      45 53 32 35 36                    // "ES256"
  a2                                    // map(2)
    64                                  // text(4)
      74 79 70 65                       // "type"
    64                                  // text(4)
      46 49 44 4f                       // "FIDO"
    69                                  // text(9)
      61 6c 67 6f 72 69 74 68           // "algorithm"
      6d                                // ...
    65                                  // text(5)
      52 53 32 35 36                    // "RS256"
```