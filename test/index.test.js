'use strict';

const _ = require('lodash');
const differenceValues = require('../mixin');

_.mixin({ differenceValues });

const baseJson = Object.freeze({
  a: 'ORIGINAL',
  arr: [1, 2, 3, { a: 1 }],
  more: 'ORIGINAL',
  intarr: [1, 2, 3, 4],
  newarr: [{ k: 'ORIGINAL' }, { k: 'ORIGINAL' }, 2],
  arrtwo: [{ k: 'ORIGINAL' }, { k: 'ORIGINAL' }],
  json: { a: 'ORIGINAL', b: 'ORIGINAL', d: { deep: [1, { mode: 'ORIGINAL' }], key: 'ORIGINAL' } },
  o: { sub: 'ORIGINAL' },
});

const clone = json => JSON.parse(JSON.stringify(json));
const set = (json, paths, value) => paths.forEach((p) => {
  const v = _.get(json, p);
  if (_.isArray(v)) {
    _.get(json, p, []).push(value);
  } else {
    _.set(json, p, value);
  }
});
const add = (json, paths) => set(json, paths, 'ADD');
const change = (json, paths) => set(json, paths, 'CHANGE');

describe('mixin diff-value test', () => {
  it('nothing changed', () => {
    const newJson = clone(baseJson);
    const diff = _.differenceValues(newJson, baseJson, { extract: 'only-changed' });
    expect(diff).toMatchObject({});
    expect(Object.keys(diff)).toHaveLength(0);
  });

  it('only-changed values', () => {
    const newJson = clone(baseJson);

    const paths = [
      'a',
      'json.d.deep[0]',
      'json.d.deep[1].mode',
    ];

    change(newJson, paths);
    // This must not compare on the diff
    add(newJson, ['newKey', 'json.d.deep']);

    const diff = _.differenceValues(newJson, baseJson, { extract: 'only-changed' });

    const rightJson = {};
    change(rightJson, paths);

    const compare = _.isEqual(diff, rightJson);
    expect(compare).toBeTruthy();
  });
});
