// @flow
import {
  pipe, curry, replace, slice, map,
} from 'ramda';

import {round} from 'mathjs';

const toRadix = curry(
    function toRadix(radix, source) {
      return parseInt(source, radix);
    }
);

const toHex = toRadix(16);

function execHex(source: string) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

  const preprocess = source.replace(
      shorthandRegex,
      (_, r, g, b) => r + r + g + g + b + b
  );

  const rgbRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

  return rgbRegex.exec(preprocess);
}

type RGB = {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(source: string) : RGB {
  const [r, g, b] = pipe(
      execHex,
      slice(1, 4),
      map(toHex)
  )(source);
  return {r, g, b};
}

export function rgbToHex(r: number, g: number, b: number): string {
  [r, g, b] = map(round, [r, g, b]);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function hexToDecimal(str: string): number {
  return pipe(
      replace('#', '0x'), Number
  )(str);
}
