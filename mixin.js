'use strict'

const { parse, parseISO } = require('date-fns')
const { format, utcToZonedTime } = require('date-fns-tz')

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
  dateFormatIn: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  dateFormatOut: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
}

function evaluateDate (value, verifyFormat, formatIn, formatOut) {
  // TODO: add date comparison only for some keys?

  if (value instanceof Date) {
    value = value.toISOString()
  }

  if (verifyFormat === true &&
      (typeof value === 'string' || typeof value === 'object')) {
    let isValid = false
    try {
      if (typeof value === 'string' && formatIn === DEFAULT_OPTIONS.dateFormatIn) {
        isValid = parseISO(value)
      } else {
        isValid = parse(value, formatIn, new Date())
      }
    } catch (error) {
    }

    if (isValid && !Number.isNaN(isValid.getTime())) {
      return format(utcToZonedTime(isValid, 'UTC'), formatOut, { timeZone: 'UTC' })
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
