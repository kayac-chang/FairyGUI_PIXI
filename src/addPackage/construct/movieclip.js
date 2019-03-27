
import {
  propSatisfies, includes, propEq, split,
  map,
} from 'ramda';

import {toPair} from '../../util';

import {assign} from './assign';

import {divide} from 'mathjs';

import {extras, Texture, Container} from 'pixi.js';
const {AnimatedSprite} = extras;

import {xml2js} from 'xml-js';


function getAtlasName(id, binIndex) {
  return (
      Number(binIndex) >= 0 ?
          `atlas${binIndex}` :
          `atlas_${split('_', id)[0]}`);
}

function toAnimationFrame({id, binIndex, frame}) {
  const atlasName = getAtlasName(id, binIndex);

  const {file} = it.selectResourcesConfig(propEq('id', atlasName));

  const {baseTexture} = it.getResource(file).texture;

  return new Texture(baseTexture, frame);
}

function toAnimationSpeed({attributes}) {
  const {interval} = attributes;

  const ms = 16.6;

  return divide(ms, Number(interval));
}

function getOffsetPerFrame(source) {
  const el = source.elements[0].elements;

  return map((obj) => toPair(obj.attributes.rect))(el);
}

function getFrames({src}) {
  const textureConfigs =
      it.selectTexturesConfig(propSatisfies(includes(src), 'id'));

  return map(toAnimationFrame)(textureConfigs);
}

function toJson(sourceStr) {
  return xml2js(sourceStr).elements[0];
}

function movieclip({attributes}) {
  const frames = getFrames(attributes);

  const anim = new AnimatedSprite(frames);

  const source = toJson(it.getSource(attributes.src));

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
