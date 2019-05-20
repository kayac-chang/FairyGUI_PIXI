// @flow

import {map, split} from 'ramda';

import {number} from '../convert';

function toPair(source: string): number[] | string[] {
  const strPair = split(/,/g, source);
  return map(number, strPair);
}

function removeComment(source: string) {
  return source.replace(/^\/\/.*\n/g, '');
}

export {
  toPair, removeComment,
};
