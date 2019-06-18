// @flow

import {map, split} from 'ramda';

import {number} from '../convert';

function toPair(source) {
  const strPair = split(/,/g, source);
  return map(number, strPair);
}

function removeComment(source) {
  return source.replace(/^\/\/.*\n/g, '');
}

export {
  toPair, removeComment,
};
