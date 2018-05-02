'use strict';

const _ = {
  transform: require('lodash.transform'),
  isObjectLike: require('lodash.isobjectlike'),
  isArray: require('lodash.isarraylike'),
};


const ignore = Symbol('ignore');

const mustAssignValue = (value, checkValue, controlType) => {
  switch (controlType) {
    case 'only-add':
      return checkValue === undefined;
    case 'only-remove':
      return checkValue === undefined && value !== undefined;
    case 'only-changed':
      return value !== undefined && checkValue !== undefined && value !== checkValue;
    case 'only-add-change':
    default:
      return value !== checkValue;
  }
};

const mustAssignObject = object => Object.keys(object).length > 0;

const mustAssignArray = array => array.length > 0;

const compare = (base, comparison, comparingType) => {
  if (_.isObjectLike(base)) {
    if (_.isArray(base)) {
      const comparisonArray = comparison || [];
      const newArray = base
        .map((e, i) => compare(e, comparisonArray[i], comparingType))
        .filter(e => e !== ignore);
      if (mustAssignArray(newArray)) {
        return newArray;
      }
    } else {
      const object = transformObject(base, comparison, comparingType);
      if (mustAssignObject(object)) {
        return object;
      }
    }
  } else if (mustAssignValue(base, comparison, comparingType)) {
    return base;
  }
  return ignore;
};

const transformObject = (newJson, oldJson, comparingType) =>
  _.transform(newJson, (result, value, key) => {
    const compareVal = oldJson !== undefined ? oldJson[key] : undefined;
    const out = compare(value, compareVal, comparingType);
    if (out !== ignore) {
      // FIXME: doesn't works..
      // Object.defineProperty(result, key, { value: out, writable: true });
      result[key] = out;
    }
  }, {});

function differenceValues(newJson, oldJson, opts = {}) {
  let out;
  if (opts.extract === 'only-remove') {
    out = transformObject(oldJson, newJson, opts.extract);
  } else {
    out = transformObject(newJson, oldJson, opts.extract);
  }
  return out;
}

module.exports = differenceValues;
