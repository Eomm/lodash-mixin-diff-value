'use strict'

const _ = require('lodash')
const t = require('tap')
const differenceValues = require('../mixin')

_.mixin({ differenceValues })

const baseJson = Object.freeze({
  a: 'ORIGINAL',
  arr: [1, 2, 3, { a: 1 }],
  more: 'ORIGINAL',
  intarr: [1, 2, 3, 4],
  newarr: [{ k: 'ORIGINAL' }, { k: 'ORIGINAL' }, 2],
  arrtwo: [{ k: 'ORIGINAL' }, { k: 'ORIGINAL' }],
  json: { a: 'ORIGINAL', b: 'ORIGINAL', d: { deep: [1, { mode: 'ORIGINAL' }], key: 'ORIGINAL' } },
  o: { sub: 'ORIGINAL' },
  testDateObject: { myDate: new Date('2015-10-21T04:21:00.123Z') },
  testDateString: { myDate: '2015-10-21T04:21:00.123Z' },
  testDateStringCustomFormat: { myDate: '21/10/2015 04:21:00' }
})

const clone = json => JSON.parse(JSON.stringify(json))
const set = (json, paths, value) => paths.forEach((p) => {
  const v = _.get(json, p)
  if (_.isArray(v)) {
    _.get(json, p, []).push(value)
  } else {
    _.set(json, p, value)
  }
})
const add = (json, paths) => set(json, paths, 'ADD')
const changeWithValue = (json, paths, value) => set(json, paths, value)
const change = (json, paths) => changeWithValue(json, paths, 'CHANGE')
const remove = (json, paths) => _.omit(json, paths)
const keep = (json, paths) => _.pick(json, paths)

let newJson
t.beforeEach((t) => { newJson = clone(baseJson) })

t.test('nothing changed', (t) => {
  const diff = _.differenceValues(newJson, baseJson)
  t.plan(2)
  t.strictSame(diff, {})
  t.strictSame(Object.keys(diff), [])
})

t.test('only-changed and added', (t) => {
  t.plan(1)
  const paths = [
    'a',
    'json.d.deep[0]',
    'json.d.deep[1].mode'
  ]

  const pathsDate = ['testDateObject.myDate']
  const changedDate = new Date('1995-07-20T04:21:00.123Z')

  const sideEffectEditJson = (json) => {
    change(json, paths)
    changeWithValue(json, pathsDate, changedDate)
    add(json, ['newKey', 'json.d.deep'])
  }

  sideEffectEditJson(newJson)
  const diff = _.differenceValues(newJson, baseJson)

  const rightJson = {}
  sideEffectEditJson(rightJson)

  t.strictSame(diff, rightJson)
})

t.test('date test with different time and same day', (t) => {
  t.plan(1)
  const paths = [
    'a',
    'json.d.deep[0]',
    'json.d.deep[1].mode'
  ]

  const pathsDate = ['testDateStringCustomFormat.myDate']
  // NB: changed only the hours!
  const changedDate = '21/10/2015 05:21:00'

  change(newJson, paths)
  changeWithValue(newJson, pathsDate, changedDate)

  const options = {
    dateFormatIn: 'dd/mm/yyyy HH:mm:ss',
    dateFormatOut: 'yyyy-mm-dd'
  }
  const diff = _.differenceValues(newJson, baseJson, options)

  /**
   * the field 'testDateStringCustomFormat.myDate' isn't expected,
   * because the format check only the date e not the time
   */
  const rightJson = {}
  change(rightJson, paths)

  t.strictSame(diff, rightJson)
})

t.test('date test different in-out', (t) => {
  t.plan(1)
  const paths = [
    'a',
    'json.d.deep[0]',
    'json.d.deep[1].mode'
  ]

  const pathsDate = ['testDateStringCustomFormat.myDate']
  // NB: changed only the minutes!
  const changedDate = '21/10/2015 05:55:00'

  change(newJson, paths)
  changeWithValue(newJson, pathsDate, changedDate)

  const options = {
    dateFormatIn: 'DD/MM/YYYY HH:mm:ss',
    dateFormatOut: 'YYYY-MM-DD HH'
  }
  const diff = _.differenceValues(newJson, baseJson, options)

  /**
   * the field 'testDateStringCustomFormat.myDate' is expected,
   * because the format check date and hours
   */
  const rightJson = {}
  change(rightJson, paths)
  changeWithValue(rightJson, pathsDate, changedDate)

  t.strictSame(diff, rightJson)
})

t.test('date test without dateCheck', (t) => {
  t.plan(1)
  const paths = ['a']

  const pathsDate = ['testDateStringCustomFormat.myDate']
  // NB: changed only the hours!
  const changedDate = '21/10/2015 05:21:00'

  change(newJson, paths)
  changeWithValue(newJson, pathsDate, changedDate)

  const options = {
    dateCheck: false,
    dateFormatIn: 'DD/MM/YYYY HH:mm:ss',
    dateFormatOut: 'YYYY-MM-DD'
  }
  const diff = _.differenceValues(newJson, baseJson, options)

  /**
   * the field 'testDateStringCustomFormat.myDate' now is expected,
   * because the format check didn't happen
   */
  const rightJson = {}
  change(rightJson, paths)
  changeWithValue(rightJson, pathsDate, changedDate)

  t.strictSame(diff, rightJson)
})

t.test('only-changed values', (t) => {
  t.plan(1)
  const paths = [
    'a',
    'json.d.deep[0]',
    'json.d.deep[1].mode'
  ]

  change(newJson, paths)
  // This must not compare on the diff
  add(newJson, ['newKey', 'json.d.deep'])

  const diff = _.differenceValues(newJson, baseJson, { extract: 'only-changed' })

  const rightJson = {}
  change(rightJson, paths)

  t.strictSame(diff, rightJson)
})

t.test('only-add values', (t) => {
  t.plan(1)
  const paths = [
    'o.sub',
    'json.d.deep[0]',
    'json.d.deep[1].mode'
  ]

  change(newJson, paths)
  add(newJson, ['newKey', 'json.d.deep', 'json.c'])

  const diff = _.differenceValues(newJson, baseJson, { extract: 'only-add' })

  const rightJson = {}
  // added [0] otherwise lodash will use the not-existing field like key-value pair
  add(rightJson, ['newKey', 'json.d.deep[0]', 'json.c'])

  t.strictSame(diff, rightJson)
})

t.test('only-remove values', (t) => {
  t.plan(1)
  const removedFields = ['a', 'o', 'json.d', 'intarr', 'arr[0]']
  newJson = remove(newJson, removedFields)

  const diff = _.differenceValues(newJson, baseJson, { extract: 'only-remove' })

  const rightJson = keep(baseJson, removedFields)
  t.strictSame(diff, rightJson)
})
