import anime from 'animejs';
import {
  pipe, split, map, mergeRight, transpose,
  test, anyPass, prop,
} from 'ramda';

import {
  toNumberPair, hexToDecimal, rgbToHex,
  hexToRgb, toDeltaTime,
} from '../../util';

function toColor(tint) {
  const [start, end] = map(hexToRgb)(tint);

  const r = [start.r, end.r];
  const g = [start.g, end.g];
  const b = [start.b, end.b];

  return {
    r, g, b,
    round: 1,
    update: function () {
      const {r, g, b} = targets;

      const hex = rgbToHex(r, g, b);
      const color = hexToDecimal(hex);
      element.tint = color;
    },
  };
}

function byType({type}) {
  return {
    XY: toPosition,
    Size: toSize,
    Alpha: toAlpha,
    Rotation: toRotation,
    Scale: toScale,
    Skew: toSkew,
    Color: toColor,
  }[type];
}

function easing(source = 'Quad.Out') {
  if (anyPass([test(/Bounce+/i), test(/linear/i)])(source)) return 'linear';

  const [func, type] = split('.', source);

  return 'ease'.concat(type, func);
}

function getTarget({type, target}) {
  const element = it.comp.getChildByName(name(target));

  const control = getControlTargetByType(type);

  return {element, control};

  function name(target) {
    return split('_', target)[0];
  }

  function getControlTargetByType(type) {
    return (
        (type === 'Scale') ? element.scale:
        (type === 'Skew') ? element.skew:
        (type === 'Color') ? {r: 0, g: 0, b: 0}:
            element
    );
  }
}

//  {type, target, time, duration, endValue, startValue, ease}

function process(attributes) {
  const {time, duration, ease} = attributes;

  const byFrameRate = toDeltaTime(24);

  const mapping = byType(attributes);

  const {element, control} = getTarget(attributes);




  return {
    begin,
    duration: byFrameRate(duration),
    time: byFrameRate(time),
    easing: easing(ease),
  };

  function begin() {
    const pair = toNumberPair(attributes.startValue);

    anime.set(control, mapping(...pair));
  }
}


function transition({attributes, elements}) {
  elements
      .map(prop('attributes'))
      .map(process)
      .reduce(addTimeFrame, anime.timeline());

  function addTimeFrame(time, frame) {
    return time.add(frame, frame.time);
  }
}

export {transition};
