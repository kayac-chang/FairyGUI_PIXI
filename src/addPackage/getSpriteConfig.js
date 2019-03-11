// @flow
import {split, find, reduce, map} from 'ramda';
import {Rectangle, Sprite} from 'pixi.js';

function getAtlasName(id, binIndex) {
  return (
      Number(binIndex) >= 0 ?
          `atlas${binIndex}` :
          `atlas_${split('_', id)[0]}`);
}

// function toRotate([rv]) {
//   return (rv === '1' ? 6 : 0);
// }
//
// function toOrig([width, height, rotate]) {
//   return (rotate !== 0) && new Rectangle(0, 0, width, height);
// }

function getTexture(id, binIndex) {
  const atlasName = getAtlasName(id, binIndex);

  const {file} = find(
      (data) => data.id === atlasName,
      it.resourcesConfig
  );

  const {texture} = it.getResource(it.packageName + '@' + file);

  return texture;
}

function convert(map, [id, binIndex, x, y, width, height, rv]) {
  // const rotate = toRotate([rv]);

  // const orig = toOrig([width, height, rotate]);

  const texture = getTexture(id, binIndex);

  texture.frame = new Rectangle(x, y, width, height);

  map[id] = new Sprite(texture);

  return map;
}

function getSpriteConfig(source) {
  const chunk = split(/\n/, source);

  const data = map(split(/\s/))(chunk);

  return reduce(convert, {})(data);
}

export {getSpriteConfig};
