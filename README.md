# lodash-mixin-diff-value

[![Build Status](https://github.com/Eomm/lodash-mixin-diff-value/workflows/ci/badge.svg)](https://github.com/Eomm/lodash-mixin-diff-value/actions)
[![npm version](https://badge.fury.io/js/lodash-mixin-diff-value.svg)](https://badge.fury.io/js/lodash-mixin-diff-value)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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
| dateFormatIn | [date-fns formats](https://date-fns.org/v2.29.3/docs/parse) | `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'` | The format to use to evaluate string during date checking
| dateFormatOut | [date-fns formats](https://date-fns.org/v2.29.3/docs/parse) | `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'` | The format to use to evaluate date-string comparison

### Field: extract

+ `only-add`: will return only field that occurs in `editedJson` and not in `originalJson`
+ `only-remove`: will return only field that not occurs in `editedJson` and are in `originalJson`
+ `only-changed`: will return only field that occurs in `editedJson` and `originalJson` too
+ `only-add-change`: like `only-add` + `only-changed`

### Field: dateCheck

If `true`: activate deep controls for the date object and strings. The input are evaluated with the `options.dateFormatIn` format and compared using the `options.dateFormatOut` format.
This will enable you to read corectly a date in a format like `options.dateFormatIn: yyyy-MM-dd` but consider the date changed only if the year and month change `options.dateFormatOut: yyyy-MM`.

If `false`: only Date objects are evaluated as `date.toISOString()` for comparison.

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

Copyright [Manuel Spigolon](https://github.com/Eomm), Licensed under [MIT](./LICENSE).
