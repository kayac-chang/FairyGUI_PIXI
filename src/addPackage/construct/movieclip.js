// @flow
import {
  propSatisfies, includes, propEq, map,
  clone,
} from 'ramda';

import {toPair} from '../../util';

import {assign} from './assign';

import {divide} from 'mathjs';

import {placeHolder} from './index';

import {
  BLEND_MODES, extras, Texture, filters,
} from 'pixi.js';

const {AnimatedSprite} = extras;
const {ColorMatrixFilter} = filters;

import {getAtlasName} from './index';

import {Component} from '../override/Component';
import {string2hex} from '../../core';

function toAnimationSpeed({attributes}) {
  const {interval} = attributes;

  const ms = 16.6;

  return divide(ms, Number(interval));
}

function getOffsetPerFrame(source) {
  const el = source.elements[0].elements;

  return map((obj) => toPair(obj.attributes.rect))(el);
}

function toFrames(src) {
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
function movieclip({attributes}) {
  const _attr = clone(attributes);

  const source = temp.getSource(_attr.src);

  const offsets = getOffsetPerFrame(source);

  const frames = toFrames(_attr.src, offsets);

  const anim = new AnimatedSprite(frames);

  const maxFrame = frames.reduce((a, b) => {
    const rectA = a.width * a.height;
    const rectB = b.width * b.height;
    return rectA > rectB ? a : b;
  });

  const size = Math.max(maxFrame.width, maxFrame.height);

  const placeholder = placeHolder(size, size);

  const it = Component();
  it.addChild(placeholder, anim);

  //  Filter
  if (_attr.filter === 'color') {
    let [
      brightness, contrast, saturate, hue,
    ] = toPair(_attr.filterData);

    const filter = new ColorMatrixFilter();

    if (brightness) {
      filter.brightness(brightness);
    }
    if (contrast) {
      filter.contrast(contrast);
    }
    if (saturate) {
      filter.saturate(saturate);
    }
    if (hue) {
      filter.hue((hue * 180) - 10);
    }

    it.filters = [filter];
  }

  //  Blend Mode
  if (_attr.blend) {
    const blendMode = BLEND_MODES[_attr.blend.toUpperCase()];

    if (_attr.filter) {
      it.filters
        .forEach((filter) => filter.blendMode = blendMode);
    } else {
      anim.blendMode = blendMode;
    }
  }

  //  Color
  if (_attr.color) {
    anim.tint = string2hex(_attr.color);
  }

  anim.animationSpeed = toAnimationSpeed(source);

  anim.onFrameChange = function(currentFrame) {
    const [offsetX, offsetY] = offsets[currentFrame];

    anim.position.set(offsetX, offsetY);

    anim.emit('change', currentFrame);

    if (currentFrame === frames.length - 1) {
      anim.emit('complete');
    }
  };

  anim.gotoAndStop(frames.indexOf(maxFrame));

  it.anim = anim;

  //  Anchor
  if (_attr.anchor === 'true') {
    const [pivotX, pivotY] = toPair(_attr.pivot);
    it.anchor.set(pivotX, pivotY);
    it.pivot.set(it.width * pivotX, it.height * pivotY);

    _attr.anchor = undefined;
  }

  return assign(it, _attr);
}

export {movieclip};
