# lodash-mixin-diff-value
This is a lodash mixin for getting a JSON object that rappresent the value variation of an object respect another.

# Roadmap

This is a fast mixin because I need it "yesterday" (no-test, no-jdoc, no-better-lodash-imports), the taget is build an official lodash Object's function.

The functions that will be implemented are:
+ get a JSON with all the values from JSON-A that are changed respect JSON-B
+ get a JSON with all the keys from JSON-A that are added respect JSON-B
+ get a JSON with all the keys from JSON-A that are missing respect JSON-B
+ autoloading mixin

The actual functionality are:
+ get a JSON with all the values from JSON-A that are changed or the keys added respect JSON-B

## Installation

```
npm install lodash-mixin-diff-value
```


### Usage

```js
const _ = require('lodash');
const differenceValues = require('./lodash-mixin-diff-value');

_.mixin({ differenceValues });

const oldObj = {
  a: 'b',
  arr: [1, 2, 3, { a: 111 }],
  more: 'more',
  intarr: [1, 2, 3, 4],
  newarr: [{ k: 'XXX' }, { k: 'val' }, 3333],
  arrtwo: [{ k: 'nod' }, { k: 'val' }],
  json: { a: 'a', b: 'b', c: 'c', d: { deep: [12, 3, { mode: 'deep' }] } },
  o: { sub: 'json' },
};

const newObj = {
  a: 'b',
  arr: [1, 22, 3, { a: 111, q: 'none' }],
  intarr: [1, 2, 3, 4],
  newarr: [{ k: 'XXX' }, { k: 'val' }, 3333],
  arrtwo: [{ k: 'XXX' }, { k: 'val' }, 3333],
  json: { a: 'a', b: 'b', c: 'c', d: { deep: [12, 333, { mode: 'deeper' }] } },
  o: { sub: 'json' },
};

const out = _.differenceValues(newObj, oldObj);
```

This exeample will print out:
```js
out:  {
  "arr": [
    22,
    {
      "q": "none"
    }
  ],
  "arrtwo": [
    {
      "k": "XXX"
    },
    3333
  ],
  "json": {
    "d": {
      "deep": [
        666,
        {
          "mode": "deeper"
        }
      ]
    }
  }
}
```


## License
(The MIT License)

Copyright (c) 2018 Manuel Spigolon <behemoth89@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
