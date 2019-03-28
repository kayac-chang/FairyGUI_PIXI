// @flow
import {split, map} from 'ramda';
import {Rectangle} from 'pixi.js';

function convert([id, binIndex, x, y, width, height]) {
  const frame = new Rectangle(x, y, width, height);

  return {id, binIndex, frame};
}

function getTexturesConfig(source) {
  const chunk = split(/\n/, source);

  const data = map(split(/\s/))(chunk);

  return map(convert, data);
}

export {getTexturesConfig};
