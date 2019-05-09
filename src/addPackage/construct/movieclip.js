// @flow
import {
  propSatisfies, includes, propEq, map,
} from 'ramda';

import {toPair} from '../../util';

import {assign} from './assign';

import {divide} from 'mathjs';

import {placeHolder} from './index';

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

function toFrames(src): Texture {
  let textureConfigs =
    temp.selectTexturesConfig(propSatisfies(includes(src), 'id'));

  textureConfigs =
    textureConfigs.map((config) => {
      config.index = Number(config.id.split('_')[1]);
      return config;
    })
      .sort((a, b) => a.index - b.index);

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
  const source = temp.getSource(attributes.src);

  const offsets = getOffsetPerFrame(source);

  const frames = toFrames(attributes.src, offsets);

  const anim = new AnimatedSprite(frames);

  const it = assign(new Container(), attributes);

  const maxFrame = frames.reduce((a, b) => {
    const rectA = a.width * a.height;
    const rectB = b.width * b.height;
    return rectA > rectB ? a : b;
  });

  const placeholder = placeHolder(maxFrame.width, maxFrame.height);

  it.addChild(placeholder, anim);

  anim.animationSpeed = toAnimationSpeed(source);

  anim.onFrameChange = function(index) {
    const [offsetX, offsetY] = offsets[index];

    anim.position.x = offsetX;
    anim.position.y = offsetY;

    it.emit('frameChange', index);
  };

  anim.gotoAndStop(frames.indexOf(maxFrame));
  anim.gotoAndStop(0);

  it.gotoAndStop = (...args) => anim.gotoAndStop(...args);
  it.gotoAndPlay = (...args) => anim.gotoAndPlay(...args);
  it.play = () => anim.play();

  it.anim = anim;

  anim.play();

  return it;
}

export {movieclip};
