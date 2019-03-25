import anime from 'animejs';
import {
  pipe, split, map, mergeRight,
  transpose, test, anyPass,
} from 'ramda';
import {divide, multiply, pi} from 'mathjs';
import {toNumberPair} from '../../util';

function radians(num: number) {
  return multiply(divide(num, 180), pi);
}

function toMilliseconds(str) {
  return pipe(
      Number,
      (num) => divide(num, 24),
      (num) => multiply(num, 1000),
  )(str);
}

function toPosition([x, y]) {
  return {x, y};
}

function toSize([width, height]) {
  return {width, height};
}

function toAlpha([alpha]) {
  return {alpha};
}

function toRotation([rotation]) {
  return {rotation: radians(rotation)};
}

function toScale([x, y]) {
  return {x, y};
}

function toSkew([_x, _y]) {
  const x = map((x) => -1 * radians(x))(_x);
  const y = map((x) => radians(x))(_y);
  return {x, y};
}

function mapFuncByType({type, target, startValue, endValue}) {
  const func = (
      (type === 'XY') ? toPosition :
          (type === 'Size') ? toSize :
              (type === 'Alpha') ? toAlpha :
                  (type === 'Rotation') ? toRotation :
                      (type === 'Scale') ? toScale :
                          (type === 'Skew') ? toSkew :
                              undefined
  );

  return pipe(
      map(toNumberPair),
      transpose,
      func,
      mergeRight({targets: getTarget(target)})
  )([startValue, endValue]);

  function getTarget(str) {
    const element = it.comp.getChildByName(split('_', str)[0]);

    if (type === 'Scale') {
      return element.scale;
    } else if (type === 'Skew') {
      return element.skew;
    }
    return element;
  }
}

function toEasing(str = 'Quad.Out') {
  if (anyPass([
    test(/Bounce+/i), test(/linear/i),
  ])(str)) return 'linear';

  const [func, type] = split('.', str);

  return 'ease'.concat(type, func);
}

function process({attributes}) {
  const {
    type, target,
    time, duration,
    endValue, startValue,
    ease,
  } = attributes;

  return mergeRight(
      mapFuncByType({type, target, startValue, endValue}),
      {
        duration: toMilliseconds(duration),
        time: toMilliseconds(time),
        easing: toEasing(ease),
        round: 100,
      }
  );
}

function addTimeFrame(time, frame) {
  return time.add(frame, frame.time);
}

function transition({attributes, elements}) {
  log(elements);

  const datas = elements.map(process);

  log(datas);

  datas.reduce(
      addTimeFrame, anime.timeline());
}

export {transition};
