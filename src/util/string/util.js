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

export {
  split, toNumberPair,
};
