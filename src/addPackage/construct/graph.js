import {Graphics} from 'pixi.js';

import {toPair} from '../../util';
import {string2hex} from '../../core';

import {assign} from './assign';

import {pipe} from 'ramda';
import {Anchorable} from '../override/Anchor';

function preprocess(attributes) {
  const lineSize = attributes.lineSize ? Number(attributes.lineSize) : 1;

  const lineColor = string2hex(attributes.lineColor || '#ff000000');

  const fillColor = string2hex(attributes.fillColor || '#ffffffff');

  const func = mapFuncBy(attributes);

  const size = mapSizeBy(func, attributes);

  return {func, lineSize, lineColor, fillColor, size};
}

function mapFuncBy({type, corner}) {
  if (type === 'eclipse') return 'drawEllipse';

  if (type === 'rect') {
    if (corner) return 'drawRoundedRect';
    return 'drawRect';
  }
}

function rectangle(size) {
  const [width, height] = toPair(size);
  const x = 0;
  const y = 0;

  return [x, y, width, height];
}

function ellipse(size) {
  const [w, h] = toPair(size);
  const x = (w / 2);
  const y = (h / 2);
  const width = (w / 2);
  const height = (h / 2);

  return [x, y, width, height];
}

function mapSizeBy(func, {size, corner}) {
  if (func === 'drawEllipse') return ellipse(size);

  if (func === 'drawRect') return rectangle(size);
  if (func === 'drawRoundedRect') {
    return [
      ...rectangle(size),
      Number(corner),
    ];
  }
}

function setGraphics({func, lineSize, lineColor, fillColor, size}) {
  const it = new Graphics();

  it.lineStyle(lineSize, lineColor);

  it.beginFill(fillColor);

  it[func](...size);

  it.endFill();

  return it;
}

/*
 *  Mapping graph to PIXI.Graphics
 */
function graph({attributes}): Graphics {
  const graphics = (
    (attributes.type) ?
      pipe(preprocess, setGraphics)(attributes) :
      new Graphics()
  );

  Anchorable(graphics);

  return assign(graphics, attributes);
}

export {graph};
