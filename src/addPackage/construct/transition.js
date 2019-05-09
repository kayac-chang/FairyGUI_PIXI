// @flow
import anime, {AnimeTimelineInstance} from 'animejs';
import {
  split, mergeWith,
  test, anyPass, prop,
} from 'ramda';

import {toPair, bool} from '../../util';

import {
  position, size, alpha, rotation,
  scale, skew, pivot, visible, tint,
  hexToRgb, deltaTime,
} from '../../core';

function mapByType({type}) {
  return {
    XY: position,
    Size: size,
    Alpha: alpha,
    Rotation: rotation,
    Scale: scale,
    Skew: skew,
    Color: hexToRgb,
    Pivot: pivot,
    Visible: visible,
  }[type];
}

function easing(source = 'Quad.Out') {
  if (anyPass([test(/Bounce+/i), test(/linear/i)])(source)) {
    return 'linear';
  }

  const [func, type] = split('.', source);
  return 'ease'.concat(type, func);
}

function getTarget({type, target}) {
  const element = temp.getChild(target);

  const targets = getControlTargetByType(type);

  return {element, targets};

  function getControlTargetByType(type) {
    return (
      (type === 'Scale') ? element.scale :
        (type === 'Skew') ? element.skew :
          (type === 'Pivot') ? element.pivot :
            (type === 'Color') ? {r: 0, g: 0, b: 0} :
              element
    );
  }
}

function shouldAnimate(attributes) {
  return attributes.tween === 'true';
}

function getFromTo(attributes) {
  const mapping = mapByType(attributes);

  const {startValue, endValue} = attributes;
  const start = mapping(...(toPair(startValue)));
  const end = mapping(...(toPair(endValue)));

  return mergeWith((a, b) => [a, b])(start, end);
}

function tweenAnimation(attributes) {
  const fromTo = getFromTo(attributes);

  const byFrameRate = deltaTime(24);

  const {element, targets} = getTarget(attributes);

  return {
    targets,
    ...fromTo,
    duration: byFrameRate(attributes.duration),
    time: byFrameRate(attributes.time),
    easing: easing(attributes.ease),
    update,
  };

  function update() {
    if (attributes.type === 'Color') {
      element.tint = tint(targets);
    }
  }
}

function keyFrame(attributes) {
  const mapping = mapByType(attributes);

  const result = mapping(...(toPair(attributes.value)));

  const byFrameRate = deltaTime(24);

  const {targets} = getTarget(attributes);

  const time =
    byFrameRate(attributes.time) === 0 ? 0 : byFrameRate(attributes.time);

  return {
    time,
    begin,
  };

  function begin(anim) {
    anim.set(targets, result);
  }
}

function process(attributes) {
  if (shouldAnimate(attributes)) {
    return tweenAnimation(attributes);
  }
  return keyFrame(attributes);
}

function getLoop(repeat, elements) {
  if (!repeat) return 1;

  if (repeat === '-1') return true;

  const flag =
    elements.some(({attributes}) => attributes.repeat === '-1');

  if (flag) return true;

  return Number(repeat);
}

function whenYOYO(elements) {
  const flag =
    elements.some(({attributes}) => attributes.yoyo === 'true');

  if (flag) return 'alternate';
}

/*
 *  Map transition type to anime.AnimeTimelineInstance
 *
 *  See Anime.js
 */
function transition({attributes, elements}): AnimeTimelineInstance {
  const timeLine = elements
    .map(prop('attributes'))
    .map(process)
    .reduce(addTimeFrame, anime.timeline());

  timeLine.name = attributes.name;

  timeLine.loop = getLoop(attributes.autoPlayRepeat, elements);

  timeLine.direction = whenYOYO(elements);

  if (isAutoPlay()) {
    timeLine.restart();
  }

  return timeLine;

  function addTimeFrame(time, frame) {
    return time.add(frame, frame.time);
  }

  function isAutoPlay() {
    return bool(attributes.autoPlay);
  }
}

export {transition};
