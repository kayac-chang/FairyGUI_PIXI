// @flow
import {pipe, curry, replace} from 'ramda';

const toRadix = curry(
    function toRadix(radix, source) {
      return parseInt(source, radix);
    }
);

const toHex = toRadix(16);

function execHex(source: string) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

  const preprocess = replace(
      shorthandRegex,
      (_, r, g, b) => r + r + g + g + b + b
  );

  const exec = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec;

  return pipe(
      preprocess, exec
  )(source);
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
  const num = toHex((1 << 24) + (r << 16) + (g << 8) + b);

  return '#' + String(num).slice(1);
}

export function hexToDecimal(str: string): number {
  return pipe(
      replace('#', '0x'), Number
  )(str);
}
