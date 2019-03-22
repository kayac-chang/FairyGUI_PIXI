import anime from 'animejs';
import {pipe, split} from 'ramda';
import {divide, multiply} from 'mathjs';
import {toNumberPair} from '../../util';

function toMilliseconds(str) {
  return pipe(
      Number,
      (num) => divide(num, 24),
      (num) => multiply(num, 1000),
  )(str);
}

function getTarget(str) {
  return it.comp.getChildByName(split('_', str)[0]);
}

function process(attributes) {
  const {
    // type,
    duration, endValue, startValue, target,
  } = attributes;

  const [startA, startB] = toNumberPair(startValue);
  const [endA, endB] = toNumberPair(endValue);

  const result = {
    x: [startA, endA],
    y: [startB, endB],
  };

  return Object.assign(result, {
    targets: getTarget(target),
    duration: toMilliseconds(duration),
  });
}

function animation({attributes}) {
  const data = process(attributes);

  anime(data);

  log(data);
}

function transition({attributes, elements}) {
  log(attributes);
  log(elements);

  elements.map(animation);
}

export {transition};
