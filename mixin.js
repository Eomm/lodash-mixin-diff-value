'use strict'

const moment = require('moment')

const _ = {
  transform: require('lodash.transform'),
  isObjectLike: require('lodash.isobjectlike'),
  isArray: require('lodash.isarraylike'),
  isDate: require('lodash.isdate'),
  defaults: require('lodash.defaults')
}

const ignore = Symbol('ignore')

const DEFAULT_OPTIONS = {
  extract: 'only-add-change',
  dateCheck: true,
  dateFormatIn: 'YYYY-MM-DDTHH:mm:ss.sssZ',
  dateFormatOut: 'YYYY-MM-DDTHH:mm:ss.sssZ'
}

function evaluateDate (value, verifyFormat, formatIn, formatOut) {
  // TODO: add date comparison only for some keys?
  if (_.isDate(value)) {
    value = value.toJSON()
  }

  if (verifyFormat === true) {
    const analize = moment.utc(value, formatIn, true)
    if (analize.isValid()) {
      return analize.format(formatOut)
    }
  }
  return value
}

function mustAssignValue (value, checkValue, opts) {
  value = evaluateDate(value, opts.dateCheck, opts.dateFormatIn, opts.dateFormatOut)
  checkValue = evaluateDate(checkValue, opts.dateCheck, opts.dateFormatIn, opts.dateFormatOut)

  switch (opts.extract) {
    case 'only-add':
      return checkValue === undefined
    case 'only-remove':
      return checkValue === undefined && value !== undefined
    case 'only-changed':
      return value !== undefined && checkValue !== undefined && value !== checkValue
    case 'only-add-change':
    default:
      return value !== checkValue
  }
}

function mustAssignObject (object) {
  return Object.keys(object).length > 0
}

function mustAssignArray (array) {
  return array.length > 0
}

function compare (base, comparison, opts) {
  if (_.isObjectLike(base) && !_.isDate(base)) {
    if (_.isArray(base)) {
      const comparisonArray = comparison || []
      const newArray = base
        .map((e, i) => compare(e, comparisonArray[i], opts))
        .filter(e => e !== ignore)
      if (mustAssignArray(newArray)) {
        return newArray
      }
    } else {
      const object = transformObject(base, comparison, opts)
      if (mustAssignObject(object)) {
        return object
      }
    }
  } else if (mustAssignValue(base, comparison, opts)) {
    return base
  }
  return ignore
}

function transformObject (newJson, oldJson, opts) {
  return _.transform(newJson, (result, value, key) => {
    const compareVal = oldJson !== undefined ? oldJson[key] : undefined
    const out = compare(value, compareVal, opts)
    if (out !== ignore) {
      // Object.defineProperty(result, key, {
      //   value: out,
      //   writable: true,
      //   enumerable: true,
      //   configurable: false,
      // });
      result[key] = out
    }
  }, {})
}

module.exports = function differenceValues (newJson, oldJson, opts = {}) {
  let out
  _.defaults(opts, DEFAULT_OPTIONS)
  if (opts.extract === 'only-remove') {
    out = transformObject(oldJson, newJson, opts)
  } else {
    out = transformObject(newJson, oldJson, opts)
  }
  return out
}
