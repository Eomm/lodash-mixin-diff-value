# lodash-mixin-diff-value
[![npm version](https://badge.fury.io/js/lodash-mixin-diff-value.svg)](https://badge.fury.io/js/lodash-mixin-diff-value) [![Coverage Status](https://coveralls.io/repos/github/Eomm/lodash-mixin-diff-value/badge.svg?branch=master)](https://coveralls.io/github/Eomm/lodash-mixin-diff-value?branch=master) [![CircleCI](https://circleci.com/gh/Eomm/lodash-mixin-diff-value/tree/master.svg?style=svg)](https://circleci.com/gh/Eomm/lodash-mixin-diff-value/tree/master)

This is a lodash mixin for getting a JSON object that rappresent the value variation of a JSON respect another.

## Installation

```
npm install lodash-mixin-diff-value
```


## Usage

```js
const _ = require('lodash');
const differenceValues = require('lodash-mixin-diff-value');

_.mixin({ differenceValues });

const diff = _.differenceValues(editedJson, originalJson[, options]);
```

`options` is a json with the fields:

| Key | Values | Default | Description |
| --- | ------ | ------- | ----------- |
| extract | `[only-add, only-remove, only-changed, only-add-change]` | `only-add-change` | Described below
| dateCheck | `true` or `false` | `true` | For performance: deactivate the date object and string evaluation
| dateFormatIn | [momentjs formats](https://momentjs.com/docs/#/parsing/string-format/) | `YYYY-MM-DDTHH:mm:ss.sssZ` | The format to use to evaluate string during date checking
| dateFormatOut | [momentjs formats](https://momentjs.com/docs/#/parsing/string-format/) | `YYYY-MM-DDTHH:mm:ss.sssZ` | The format to use to evaluate date-string comparison

### Field: extract

+ `only-add`: will return only field that occurs in `editedJson` and not in `originalJson`
+ `only-remove`: will return only field that not occurs in `editedJson` and are in `originalJson`
+ `only-changed`: will return only field that occurs in `editedJson` and `originalJson` too
+ `only-add-change`: like `only-add` + `only-changed`

### Field: dateCheck

This activate the controls for the date object, evaluated as [date.toJSON()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON) string, or date string evaluated with `options.dateFormat`.

### Field: dateFormat

This format let you to execute the diff value on portion of the date string not only on the complete date.
This cost in performance because all the string will be checked if match with this format.


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
+ Managen functions


## License
(The MIT License)

Copyright (c) 2018 Manuel Spigolon <behemoth89@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
