import {toNumberPair} from '../../util';

import {divide} from 'mathjs';

import {map, evolve, split} from 'ramda';

import TWEEN, {Tween, Easing} from '@tweenjs/tween.js';

function toXY(str) {
  const [x, y] = toNumberPair(str);
  return {x, y};
}

function toMilliseconds(fpsStr) {
  return divide(Number(fpsStr), 24) * 1000;
}

const toJson = evolve({
  duration: toMilliseconds,
  endValue: toXY,
  startValue: toXY,
  time: toMilliseconds,
  tween: (bool) => bool === 'true',
  target: (str) => split('_', str)[0],
});

function item({attributes}) {
  const {
    duration, endValue, startValue, target,
    time, tween, type,
  } = toJson(attributes);

  log({
    duration, endValue, startValue, target,
    time, tween, type,
  });

  const targetElement = it.comp.getChildByName(target);

  new Tween(targetElement)
      .easing(Easing.Quadratic.Out)
      .to(endValue, duration)
      .start();
}

function transition({attributes, elements}) {
  const {name, autoPlay} = attributes;

  log(name);
  log(autoPlay);
  log(elements);

  map(item, elements);

  requestAnimationFrame(
      function animation(time) {
        requestAnimationFrame(animation);
        TWEEN.update(time);
      }
  );
}

export {transition};
