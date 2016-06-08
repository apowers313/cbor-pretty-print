# cbor-pretty-print
Parses and prints CBOR ([RFC 7049](https://tools.ietf.org/html/rfc7049))

NOTE: the CBOR parser is currently incomplete and only handles the most likely use cases: maps, byte / text strings, lists and integers. It does not handle floats, indefinite length items, negative numbers, or other types that are less frequently used. [Pull requests](https://github.com/apowers313/cbor-pretty-print/pulls) or [GitHub issues](https://github.com/apowers313/cbor-pretty-print/issues) are always welcome.

## Install
For API usage:
`npm install cbor-pretty-print`

For command line usage:
`npm install -g cbor-pretty-print`

## Command Line
`cborprint file.json` -- converts `file.json` to CBOR and then prints it out

``` 
  Usage: cborprint [options] <file>

  Converts JSON to CBOR and prints it out

  Options:

    -h, --help                  output usage information
    -V, --version               output the version number
    -i, --indent <spaces>       number of spaces for each indent level
    -s, --no-hex-space          whether or not to put a space between hex bytes (e.g. - 'FF 00' or 'FF00'
    -w, --wrap-hex <bytes>      wrap hex lines after <bytes>
    -x, --syntax                print out hex syntax in a ready to cut and paste way (e.g. - '0xFF,')
    -c, --comment <string>      string to use for comments (e.g. - '//' or '#')
    -m, --comment-column <num>  what column the comments should be aligned to
```

## API
``` js
var cp = require ("cbor-pretty-print");
cp (cbor); // prints cbor
cp (cbor, options); // prints cbor with options

var options = {
    indent: 2,              // number of spaces to indent each level
    hexSpace: true,         // put a space between hex numbers e.g. - "FF 00" instead of "FF00"
    wrapHex: 8,             // number of hex characters to print before line wrapping
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

<hr>

With the following options:
* `-x` on command line or `hexSyntax: true` in API
* `-i 8` on command line or `indent: 8` in API
* `-m 80` on command line or `commentColumn: 80` in API

```
0x82,                                                                           // list(2)
        0xa2,                                                                   // map(2)
                0x64,                                                           // text(4)
                        0x74, 0x79, 0x70, 0x65,                                 // "type"
                0x64,                                                           // text(4)
                        0x46, 0x49, 0x44, 0x4f,                                 // "FIDO"
                0x69,                                                           // text(9)
                        0x61, 0x6c, 0x67, 0x6f, 0x72, 0x69, 0x74, 0x68,         // "algorithm"
                        0x6d,                                                   // ...
                0x65,                                                           // text(5)
                        0x45, 0x53, 0x32, 0x35, 0x36,                           // "ES256"
        0xa2,                                                                   // map(2)
                0x64,                                                           // text(4)
                        0x74, 0x79, 0x70, 0x65,                                 // "type"
                0x64,                                                           // text(4)
                        0x46, 0x49, 0x44, 0x4f,                                 // "FIDO"
                0x69,                                                           // text(9)
                        0x61, 0x6c, 0x67, 0x6f, 0x72, 0x69, 0x74, 0x68,         // "algorithm"
                        0x6d,                                                   // ...
                0x65,                                                           // text(5)
                        0x52, 0x53, 0x32, 0x35, 0x36,                           // "RS256"
```

<hr>

With the following options:
* `-w 16` on command line or `wrapHex: 16` in API
* `-s` on command line or `hexSpace: false` in API
* `-c --` on command line or `comment: "--"` in API

```
83                                                          -- list(3)
  61                                                        -- text(1)
    78                                                      -- "x"
  6a                                                        -- text(10)
    30313030303030303132                                    -- "0100000012"
  7890                                                      -- text(144)
    33303436303232313030633539653334                        -- "3046022100c59e3484b03f0cc956ea5969d81ba98306bcde89fe331dce7ef69e31ca5435a3022100e48815ed05a7617a89799ab90fdc01a8df9766b15f45d56b350b95ec0c610d6d"
    38346230336630636339353665613539                        -- ...
    36396438316261393833303662636465                        -- ...
    38396665333331646365376566363965                        -- ...
    33316361353433356133303232313030                        -- ...
    65343838313565643035613736313761                        -- ...
    38393739396162393066646330316138                        -- ...
    64663937363662313566343564353662                        -- ...
    33353062393565633063363130643664                        -- ...
```
