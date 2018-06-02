# lodash-mixin-diff-value
[![npm version](https://badge.fury.io/js/lodash-mixin-diff-value.svg)](https://badge.fury.io/js/lodash-mixin-diff-value) [![CircleCI](https://circleci.com/gh/Eomm/lodash-mixin-diff-value/tree/master.svg?style=svg)](https://circleci.com/gh/Eomm/lodash-mixin-diff-value/tree/master)

This is a lodash mixin for getting a JSON object that rappresent the value variation of a JSON respect another.

## Installation

```
npm install lodash-mixin-diff-value
```


## Usage

```js
const _ = require('lodash');
const differenceValues = require('./lodash-mixin-diff-value');

_.mixin({ differenceValues });

const diff = _.differenceValues(editedJson, originalJson[, options]);
```

`options` is a json with the fields:

| Key | Values | Default |
| --- | ------ | ------- |
| extract | `[only-add, only-remove, only-changed, only-add-change]` | `only-add-change`


### Field: extract

+ `only-add`: will return only field that occurs in `editedJson` and not in `originalJson`
+ `only-remove`: will return only field that not occurs in `editedJson` and are in `originalJson`
+ `only-changed`: will return only field that occurs in `editedJson` and `originalJson` too
+ `only-add-change`: like `only-add` + `only-changed`


## Test

For run the tests simply execute:
```
npm test
```


## Example

See test for more examples.

```js
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

// Will print out:
{
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
        333,
        {
          "mode": "deeper"
        }
      ]
    }
  }
}
```


## Todo

+ JSDoc
+ More test and validity-check
+ Manage Date and functions


## License
(The MIT License)

Copyright (c) 2018 Manuel Spigolon <behemoth89@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
