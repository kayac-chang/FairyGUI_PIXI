// @flow

import {
  split, pipe, map, trim, filter,
  fromPairs, evolve, replace,
} from 'ramda';

import {select} from '../../util';

const chunkToJSON = pipe(
    map((source) => {
      const [key, _value] = split('=', source);
      const value = replace(/"/g, '', _value);
      return [key, value];
    }),
    fromPairs
);

function toFontData([, ...source]) {
  return pipe(
      chunkToJSON,

      evolve({
        id: String.fromCodePoint,
        x: Number,
        y: Number,
        width: Number,
        height: Number,
        xoffset: Number,
        yoffset: Number,
      })
  )(source);
}

export function fnt2js(source) {
  const chunkData = pipe(
      trim,
      split(/\n/),

      map(
          pipe(
              trim,
              split(/\s+/)
          )
      )
  )(source);

  const {file} = pipe(
      select(([type]) => type === 'page'),
      ([, ...source]) => chunkToJSON(source),
  )(chunkData);

  const chars = pipe(
      filter(([type]) => type === 'char'),

      map(toFontData),
  )(chunkData);

  return {file, chars};
}
