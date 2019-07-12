// @flow
import anime from 'animejs';
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

const {assign} = Object;

function mapByType({type}) {
  return {
    'XY': position,
    'Size': size,
    'Alpha': alpha,
    'Rotation': rotation,
    'Scale': scale,
    'Skew': skew,
    'Color': hexToRgb,
    'Pivot': pivot,
    'Visible': visible,
  }[type];
}

function easing(source = 'Quad.Out') {
  if (anyPass([test(/Bounce+/i), test(/linear/i)])(source)) {
    return 'linear';
  }

  const [func, type] = split('.', source);

  if (func === 'Elastic') {
    const amplitude = 1;
    const period = 0.5;

    return 'ease' + type + 'Elastic' + `(${amplitude}, ${period})`;
  }

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

  if (!endValue) return;
  const end = mapping(...(toPair(endValue)));

  return mergeWith((a, b) => [a, b])(start, end);
}

function tweenAnimation(attributes) {
  const fromTo = getFromTo(attributes);

  if (!fromTo) return {};

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
  const {targets} = getTarget(attributes);

  const byFrameRate = deltaTime(24);

  const time =
    byFrameRate(attributes.time) === 0 ?
      0 : byFrameRate(attributes.time);

  const animation = {type: 'keyFrame', time};

  if (attributes.type === 'Transition') {
    //
    let [name, loop] = attributes.value.split(',');

    const transition = targets.transition[name];

    animation.call = () => {
      transition.loop =
        (loop === '-1') ? true :
          (loop !== undefined) ? Number(loop) :
            undefined;

      (loop === '0') ? transition.pause() : transition.play();
    };
    //
  } else if (attributes.type === 'Animation') {
    //
    const [frame, command] = attributes.value.split(/,/g);

    const anim = targets.anim;

    animation.call =
      (command === 'p') ? () => anim.gotoAndPlay(Number(frame)) :
        (command === 's') ? () => anim.gotoAndStop(Number(frame)) :
          undefined;
    //
  } else {
    //
    const mapping = mapByType(attributes);

    const result = mapping(...(toPair(attributes.value)));

    animation.call = () => assign(targets, result);
    //
  }

  return animation;
}

function process(attributes) {
  if (shouldAnimate(attributes)) {
    return tweenAnimation(attributes);
  } else {
    return keyFrame(attributes);
  }
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
function transition({attributes, elements}) {
  let timeLine = {};

  const keyFrames = [];

  try {
    timeLine = elements
      .map(prop('attributes'))
      .map(process)
      .reduce(addTimeFrame, anime.timeline());
  } catch (e) {
    throw new Error(
      `Occur when create Transition: ${attributes.name}, ${e}`,
    );
  }

  timeLine.name = attributes.name;

  timeLine.loop = getLoop(attributes.autoPlayRepeat, elements);

  timeLine.direction = whenYOYO(elements);

  if (isAutoPlay()) {
    timeLine.restart();
  }

  timeLine.begin = () =>
    keyFrames.forEach((func) => func());

  return timeLine;

  function addTimeFrame(time, frame) {
    if (frame.type === 'keyFrame') {
      keyFrames.push(
        () => setTimeout(frame.call, frame.time),
      );
    }

    return time.add(frame, frame.time);
  }

  function isAutoPlay() {
    return bool(attributes.autoPlay);
  }
}

export {transition};
