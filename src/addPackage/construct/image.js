import {assign} from './assign';

import {
  replace, pipe, propEq, split,
} from 'ramda';

import {Sprite, mesh} from 'pixi.js';
const {NineSlicePlane} = mesh;

function colorHex(str: string) : Number {
  return pipe(replace('#', '0x'), Number)(str);
}

function toSprite({id, binIndex, frame}) {
  const atlasName = getAtlasName(id, binIndex);

  const {file} = it.selectResourcesConfig(propEq('id', atlasName));

  const {scale9grid} = it.selectResourcesConfig(propEq('id', id));

  let {texture} = it.getResource(file);

  texture.frame = frame;

  if (scale9grid) {
    const [a, b, c, d] = scale9grid;
    const {width, height} = texture;

    const leftWidth = a;
    const topHeight = b;
    const bottomHeight = height - (b + d);
    const rightWidth = width - (a + c);

    return new NineSlicePlane(
        texture,
        leftWidth, topHeight,
        bottomHeight, rightWidth,
    );
  }

  return new Sprite(texture);

  function getAtlasName(id, binIndex) {
    return (
        Number(binIndex) >= 0 ?
            `atlas${binIndex}` :
            `atlas_${split('_', id)[0]}`);
  }
}

function image({attributes}) {
  const config =
      it.selectTexturesConfig(propEq('id', attributes.src));

  const sprite =
      assign(toSprite(config), attributes);

  if (attributes.color) {
    sprite.tint = colorHex(attributes.color);
  }

  return sprite;
}

export {image};
