// @flow
import {
  propSatisfies, includes, propEq, map,
} from 'ramda';

import {toPair} from '../../util';

import {assign} from './assign';

import {divide} from 'mathjs';

import {extras, Texture, Container} from 'pixi.js';
const {AnimatedSprite} = extras;

import {getAtlasName} from './index';

function toAnimationSpeed({attributes}) {
  const {interval} = attributes;

  const ms = 16.6;

  return divide(ms, Number(interval));
}

function getOffsetPerFrame(source) {
  const el = source.elements[0].elements;

  return map((obj) => toPair(obj.attributes.rect))(el);
}

function frames({src}): Texture {
  const textureConfigs =
      temp.selectTexturesConfig(propSatisfies(includes(src), 'id'));

  return map(toAnimationFrame)(textureConfigs);

  function toAnimationFrame({id, binIndex, frame}) {
    const atlasName = getAtlasName(id, binIndex);

    const {file} = temp.selectResourcesConfig(propEq('id', atlasName));

    const {baseTexture} = temp.getResource(file).texture;

    return new Texture(baseTexture, frame);
  }
}

/*
 *  Mapping MovieClip Type to PIXI.extra.AnimatedSprite
 */
function movieclip({attributes}: Object): Container {
  const anim = new AnimatedSprite(frames(attributes));

  const source = temp.getSource(attributes.src);

  anim.animationSpeed = toAnimationSpeed(source);

  const offsets = getOffsetPerFrame(source);

  anim.onFrameChange = function(frameIndex) {
    anim.position.set(...offsets[frameIndex]);
  };

  anim.play();

  const container = assign(new Container(), attributes);

  container.addChild(anim);

  return container;
}

export {movieclip};
