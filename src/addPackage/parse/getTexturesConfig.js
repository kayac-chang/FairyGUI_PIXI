// @flow

import {split, map} from 'ramda';
import {Rectangle} from 'pixi.js';

function convert([id, binIndex, x, y, width, height]) {
  const frame = new Rectangle(x, y, width, height);

  return {id, binIndex, frame};
}

/*
 *  Return config data about How to get textures from the atlas.
 */
function getTexturesConfig(source: string): Array<Object> {
  const chunk = split(/\n/, source);

  const data = map(split(/\s/))(chunk);

  return map(convert, data);
}

export {getTexturesConfig};
