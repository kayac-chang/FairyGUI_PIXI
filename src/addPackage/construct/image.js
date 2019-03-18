import {assign} from './assign';

import {getAtlasName} from './common';

import {
  replace, pipe, propEq,
} from 'ramda';

import {Sprite, mesh, Texture} from 'pixi.js';
const {NineSlicePlane} = mesh;

function colorHex(str: string) : Number {
  return pipe(replace('#', '0x'), Number)(str);
}

function toSprite({id, binIndex, frame}) {
  const atlasName = getAtlasName(id, binIndex);

  const {file} = it.selectResourcesConfig(propEq('id', atlasName));

  const {scale9grid} = it.selectResourcesConfig(propEq('id', id));

  const {baseTexture} = it.getResource(file).texture;

  const texture = new Texture(baseTexture, frame);

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
