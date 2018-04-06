'use strict';

const _ = require('lodash');

const ignore = Symbol('ignore');

const mustAssignValue = (value, checkValue, controlType) => {
  switch (controlType) {
    case 'only-changed':
      if (value !== undefined && checkValue !== undefined) {
        return value !== checkValue;
      }
      return false;
    case 'only-add':
      return checkValue === undefined;
    case 'only-remove':
      // TODO
      return true;
    default:
      return value !== checkValue;
  }
};

const mustAssignObject = object => Object.keys(object).length > 0;

const mustAssignArray = array => array.length > 0;

const valueToAssign = (value, checkValue, opts = {}) => {
  // console.log(`${value} vs ${checkValue}`);
  if (_.isObjectLike(value)) {
    const diffValue = differenceValues(value, checkValue, opts);
    if (mustAssignObject(diffValue)) {
      return diffValue;
    }
  } else if (mustAssignValue(value, checkValue, opts.extract)) {
    return value;
  }
  return ignore;
};

function differenceValues(newJson, oldJson, opts = {}) {
  return _.transform(newJson, (result, value, key) => {
    if (_.isArray(value)) {
      const arr2 = oldJson[key];
      const arrrrr = value
        .map((e, i) => valueToAssign(e, arr2[i], opts))
        .filter(e => e !== ignore);

      if (mustAssignArray(arrrrr)) {
        result[key] = arrrrr;
      }
    } else {
      const toAssign = valueToAssign(value, oldJson[key], opts);
      if (toAssign !== ignore) {
        result[key] = toAssign;
      }
    }
  }, {});
}

module.exports = differenceValues;
