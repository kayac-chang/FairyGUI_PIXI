// @flow
import {drop, map, pipe} from 'ramda';
import {Rectangle} from 'pixi.js';
import {split} from '../util';


function toName([itemId, binIndex]) {
  return (
      Number(binIndex) >= 0 ?
        `atlas${binIndex}` :
        `atlas_${split('_', itemId)[0]}`);
}

function toFrame(args) {
  return new Rectangle(...args.map(Number));
}

function toRotate([rv]) {
  return (rv === '1' ? 6 : 0);
}

function toOrig([width, height, rotate]) {
  return (rotate !== 0) && new Rectangle(0, 0, width, height);
}

function convert([itemId, binIndex, x, y, width, height, rv]) {
  const name = toName([itemId, binIndex]);

  const frame = toFrame([x, y, width, height]);

  const rotate = toRotate([rv]);

  const orig = toOrig([width, height, rotate]);

  return {name, frame, rotate, orig};
}

export function getAtlasConfig(data: string) {
  return pipe(
      split(/\n/), drop(1),
      map(
          pipe(split(/\s/), convert))
  )(data);
}
