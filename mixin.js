'use strict';

const _ = require('lodash');

const ignore = Symbol('ignore');

const mustAssignValue = (value, checkValue) => {
  return value !== checkValue;
};

const mustAssignObject = (object) => {
  return Object.keys(object).length > 0;
};

const mustAssignArray = (array) => {
  return array.length > 0;
};

const valueToAssign = (value, checkValue) => {
  if (_.isObjectLike(value)) {
    const diffValue = differenceValues(value, checkValue);
    if (mustAssignObject(diffValue)) {
      return diffValue;
    }
  } else if (mustAssignValue(value, checkValue)) {
    return value;
  }
  return ignore;
};

function differenceValues(newJson, oldJson) {
  return _.transform(newJson, (result, value, key) => {
    if (_.isArray(value)) {
      const arr2 = oldJson[key];
      const arrrrr = value.map((e, i) => {
        return valueToAssign(e, arr2[i]);
      }).filter(e => e !== ignore);

      if (mustAssignArray(arrrrr)) {
        result[key] = arrrrr;
      }
    } else {
      const toAssign = valueToAssign(value, oldJson[key]);
      if (toAssign !== ignore) {
        result[key] = toAssign;
      }
    }
  }, {});
}

module.exports = differenceValues;
