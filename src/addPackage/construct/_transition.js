import {toNumberPair} from '../../util';

import {divide} from 'mathjs';

import {
  evolve, split, pipe, identity, map,
} from 'ramda';

import {Tween, Easing} from '@tweenjs/tween.js';

function ifNaN(num) {
  return isNaN(num) ? undefined: num;
}

function toPos([x, y]) {
  return {x, y};
}

function toSize([width, height]) {
  return {width, height};
}

function mapFuncByType(type) {
  const func = (
      (type === 'XY') ? toPos :
          (type === 'Size') ? toSize :
              identity
  );

  return pipe(
      toNumberPair, map(ifNaN), func
  );
}

function getTarget(str) {
  return it.comp.getChildByName(split('_', str)[0]);
}

function _transition({attributes, elements}) {
  const {name} =
      evolve({
        name: String,
      })(attributes);

  log(name);
  log(attributes);
  log(elements);

  const trans = elements.map(item);

  log(trans);

  trans.reduce((a, b) => a.onComplete(() => b.start()));

  trans[0].start();

  function item({attributes}) {
    const {
      duration, endValue, startValue, target,
      time = 0, tween, type, repeat, value,
      ease = Easing.Quadratic.Out,
    } = evolve({
      duration: toMilliseconds,
      value: mapFuncByType(attributes.type),
      endValue: mapFuncByType(attributes.type),
      startValue: mapFuncByType(attributes.type),
      time: toMilliseconds,
      tween: (bool) => bool === 'true',
      target: getTarget,
      repeat: toRepeat,
      ease: toEase,
    })(attributes);

    log({
      duration, endValue, startValue, target,
      time, tween, type, ease, value,
    });

    if (!tween) {
      return new Tween(target)
          .delay(time)
          .to(value, 0);
    }

    const start = new Tween(target)
        .to(startValue, 0);

    const main = new Tween(target)
        .easing(ease)
        .repeat(repeat)
        .to(endValue, duration);

    return start.chain(main);
  }

  function toRepeat(str) {
    const times = Number(str);
    return times === -1 ? Infinity : times;
  }

  function toMilliseconds(fpsStr) {
    return divide(Number(fpsStr), 24) * 1000;
  }

  function toEase(str) {
    if (str === 'Linear') return Easing.Linear.None;

    const [name, type] = split('.', str);

    return Easing[mapping(name)][type];

    function mapping(name) {
      return (
          (name === 'Circ') ? 'Circular' :
              (name === 'Expo') ? 'Exponential' :
                  (name === 'Quad') ? 'Quadratic' :
                      (name === 'Quart') ? 'Quartic' :
                          (name === 'Quint') ? 'Quintic' :
                              (name === 'Sine') ? 'Sinusoidal' :
                                  name
      );
    }
  }
}

export {_transition};
