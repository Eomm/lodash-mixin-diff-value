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
const remove = (json, paths) => _.omit(json, paths);

describe('mixin diff-value test', () => {
  let newJson;
  beforeEach(() => { newJson = clone(baseJson); });

  it('nothing changed', () => {
    const diff = _.differenceValues(newJson, baseJson, { extract: 'only-changed' });
    expect(diff).toMatchObject({});
    expect(Object.keys(diff)).toHaveLength(0);
  });

  it('only-changed values', () => {
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

  it('only-add values', () => {
    const paths = [
      'o.sub',
      'json.d.deep[0]',
      'json.d.deep[1].mode',
    ];

    change(newJson, paths);
    add(newJson, ['newKey', 'json.d.deep', 'json.c']);

    const diff = _.differenceValues(newJson, baseJson, { extract: 'only-add' });

    const rightJson = {};
    // added [0] otherwise lodash will use the not-existing field like key-value pair
    add(rightJson, ['newKey', 'json.d.deep[0]', 'json.c']);

    const compare = _.isEqual(diff, rightJson);
    expect(compare).toBeTruthy();
  });

  it('only-remove values', () => {
    const removedFields = ['a', 'o', 'json.d', 'intarr'];
    newJson = remove(newJson, removedFields);

    const diff = _.differenceValues(newJson, baseJson, { extract: 'only-remove' });

    const rightJson = remove(baseJson, removedFields);
    const compare = _.isEqual(diff, rightJson);
    expect(compare).toBeTruthy();
  });
});
