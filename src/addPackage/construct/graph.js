import {Graphics} from 'pixi.js';
import {toPair} from '../../util';

import {assign} from './assign';

import {pipe, replace} from 'ramda';

function colorHex(str = '#ffffffff'): Number {
  return pipe(replace('#ff', '0x'), Number)(str);
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

function preprocess(attributes) {
  const lineSize = attributes.lineSize ? Number(attributes.lineSize) : 1;

  const lineColor = colorHex(attributes.lineColor || '#ff000000');

  const fillColor = colorHex(attributes.fillColor || '#ffffffff');

  const size = {
    rect: rectangle,
    eclipse: ellipse,
  }[attributes.type](attributes.size);

  const func = {
    rect: 'drawRect',
    eclipse: 'drawEllipse',
  }[attributes.type];

  return {func, lineSize, lineColor, fillColor, size};
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

  return assign(graphics, attributes);
}

export {graph};
