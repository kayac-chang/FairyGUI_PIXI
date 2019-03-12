// @flow
import {split, reduce, map} from 'ramda';
import {Rectangle} from 'pixi.js';

// function toRotate([rv]) {
//   return (rv === '1' ? 6 : 0);
// }
//
// function toOrig([width, height, rotate]) {
//   return (rotate !== 0) && new Rectangle(0, 0, width, height);
// }
function convert(map, [id, binIndex, x, y, width, height, rv]) {
  // const rotate = toRotate([rv]);

  // const orig = toOrig([width, height, rotate]);

  const frame = new Rectangle(x, y, width, height);

  map[id] = {id, binIndex, frame};

  return map;
}

function getSpriteConfig(source) {
  const chunk = split(/\n/, source);

  const data = map(split(/\s/))(chunk);

  return reduce(convert, {})(data);
}

export {getSpriteConfig};
