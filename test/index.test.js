'use strict';

const _ = require('lodash');
const differenceValues = require('../mixin');

_.mixin({ differenceValues });

const baseJson = {
  a: 'b',
  arr: [1, 2, 3, { a: 111 }],
  more: 'more',
  intarr: [1, 2, 3, 4],
  newarr: [{ k: 'XXX' }, { k: 'val' }, 3333],
  arrtwo: [{ k: 'nod' }, { k: 'val' }],
  json: { a: 'a', b: 'b', d: { deep: [12, 3, { mode: 'deep' }], key: 'value' } },
  o: { sub: 'json' },
};

const clone = json => JSON.parse(JSON.stringify(json));

describe('mixin diff-value test', () => {
  it('nothing changed', () => {
    const newJson = clone(baseJson);
    const diff = _.differenceValues(newJson, baseJson, { extract: 'only-changed' });
    expect(diff).toMatchObject({});
    expect(Object.keys(diff)).toHaveLength(0);
  });

  it('only-changed values', () => {
    const newValues = { a: 'new value', json: { d: { key: 'new value key' } } };
    const newJson = Object.assign({}, clone(baseJson), newValues);
    newJson.json.d.deep.push('new value on array');

    const diff = _.differenceValues(newJson, baseJson, { extract: 'only-changed' });
    // expect(diff).toMatchObject(); // TODO
  });
});
