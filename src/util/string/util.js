// @flow

import {curry, map} from 'ramda';

const split = curry(
    function(separator: string | RegExp, source: string) : string {
      return source.split(separator);
    }
);

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
  split, toPair, removeComment,
};
