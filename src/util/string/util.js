// @flow

import {curry, map} from 'ramda';

const split = curry(
    function(separator: string | RegExp, source: string) : string {
      return source.split(separator);
    }
);

function toNumberPair(source: string) : number[] {
  const strPair = split(',', source);
  return map(Number, strPair);
}

function removeComment(source: string) {
  return source.replace(/^\/\/.*\n$/, '');
}

export {
  split, toNumberPair, removeComment,
};
