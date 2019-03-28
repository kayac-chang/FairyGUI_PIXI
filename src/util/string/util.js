// @flow

import {map} from 'ramda';

function safeConvertNumber(source) {
  if (isNaN(source)) return source;

  return Number(source);
}

function toPair(source: string) : number[] | string[] {
  const strPair = split(',', source);
  return map(safeConvertNumber, strPair);
}

function removeComment(source: string) {
  return source.replace(/^\/\/.*\n/g, '');
}

export {
  toPair, removeComment,
};
