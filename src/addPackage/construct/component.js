// @flow
import {search, toPair} from '../../util';
import {
  map, propEq, filter,
  has, pipe, find, prop,
  identity,
} from 'ramda';

import {assign} from './assign';

import {Container, Graphics} from 'pixi.js';

import {transition} from './transition';
import {construct} from './index';
import {Button} from './button';

const {defineProperty, defineProperties} = Object;

function Component() {
  const it = new Container();

  let _anchorX = 0;
  let _anchorY = 0;

  it.anchor = {
    get x() {
      return _anchorX;
    },
    set x(newX) {
      _anchorX = newX;
      it.pivot.x = newX * it._width;
    },
    get y() {
      return _anchorY;
    },
    set y(newY) {
      _anchorY = newY;
      it.pivot.y = newY * it._height;
    },
    set(newX, newY) {
      it.anchor.x = newX;
      it.anchor.y = newY;
    },
  };

  defineProperties(it, {
    height: {
      get() {
        return it.scale.y * it.getLocalBounds().height;
      },
      set(newHeight) {
        const height = it.getLocalBounds().height;

        const {y} = it.getBounds();

        const value = (y < 0) ? newHeight - y : newHeight;

        if (height !== 0) {
          it.scale.y = value / height;
        } else {
          it.scale.y = 1;
        }

        it._height = newHeight;
      },
    },
    width: {
      get() {
        return it.scale.x * it.getLocalBounds().width;
      },
      set(newWidth) {
        const width = it.getLocalBounds().width;

        const {x} = it.getBounds();

        const value = (x < 0) ? newWidth - x : newWidth;

        if (width !== 0) {
          it.scale.x = value / width;
        } else {
          it.scale.x = 1;
        }

        it._width = newWidth;
      },
    },
  });

  return it;
}


function subComponent(attributes: Object): Component {
  const source = temp.getSource(attributes.src);

  const mapByExtension = (({extention}) => (
    (extention === 'Button') ? Button(source) :
      identity
  ))(source.attributes);

  const comp = pipe(
    topComponent,
    mapByExtension,
  )(source);

  return assign(comp, attributes);
}

function topComponent(source: Object): Component {
  const comp = new Component();

  const displayElements = pipe(
    search(({name}) => name === 'displayList'),
    prop('elements'),
    map(construct),
  )(source);

  comp.addChild(...displayElements);

  temp.getChild = (_id) => {
    const displayList = pipe(
      search(({name}) => name === 'displayList'),
      prop('elements'),
    )(source);

    const target = find(
      ({attributes}) => attributes.id === _id,
    )(displayList);

    return comp.getChildByName(target.attributes.name);
  };

  const transitions = pipe(
    search(({name}) => name === 'transition'),
    (args) => [].concat(args),
    filter(has('elements')),
    map(transition),
  )(source);

  defineProperty(comp, 'transitions', {
    get: () => transitions,
  });

  comp.getTransition = (name) =>
    find(propEq('name', name))(transitions);

  const it = assign(comp, source.attributes);
  it.scale.set(1, 1);

  if (source.attributes.mask) {
    const mask = temp.getChild(source.attributes.mask);
    const comp = JSON.parse(JSON.stringify(it.getLocalBounds()));

    if (source.attributes.reversedMask === 'true') {
      const reversedMask = new Graphics();
      drawReversedMask(comp, mask, reversedMask);

      it.addChild(reversedMask);
      it.mask = reversedMask;

      it.updateMask = function({x, y, width, height}) {
        if (width !== undefined) {
          mask.x -= (width - mask.width);
          mask.width = width;
        }
        if (height !== undefined) {
          mask.y -= (height - mask.height);
          mask.height = height;
        }
        if (x !== undefined) mask.x = x;
        if (y !== undefined) mask.y = y;

        drawReversedMask(comp, mask, reversedMask);
      };
    } else {
      it.mask = mask;

      it.updateMask = function({x, y, width, height}) {
        if (x !== undefined) mask.x = x;
        if (y !== undefined) mask.y = y;
        if (width !== undefined) mask.width = width;
        if (height !== undefined) mask.height = height;
      };
    }
  }

  if (source.attributes.overflow === 'hidden') {
    hidden(source.attributes);
  }

  return it;

  function hidden(attributes) {
    const mask = new Graphics();
    mask.name = 'mask';

    mask.beginFill(0x000);

    const [width, height] = toPair(attributes.size);
    const [x, y] = toPair(attributes.xy || '0,0');

    mask.drawRect(x, y, width, height);
    mask.endFill();

    it.addChild(mask);
    it.mask = mask;

    return it;
  }
}

function drawReversedMask(comp, mask, it) {
  const holeX = Math.max(0, mask.x);
  const holeY = Math.max(0, mask.y);
  const holeW = Math.min(
    comp.width,
    mask.x >= 0 ? mask.width : mask.width + mask.x,
  );
  const holeH = Math.min(
    comp.height,
    mask.y >= 0 ? mask.height : mask.height + mask.y,
  );

  it.clear();

  return it
    .lineStyle(0)
    .beginFill(0xFFFF0B, 0.5)
    .moveTo(0, 0)
    .lineTo(comp.width, 0)
    .lineTo(comp.width, comp.height)
    .lineTo(0, comp.height)
    .moveTo(holeX, holeY)
    .lineTo(holeX + holeW, holeY)
    .lineTo(holeX + holeW, holeY + holeH)
    .lineTo(holeX, holeY + holeH)
    .addHole();
}

/*
 *  Mapping FairyGUI component Type to PIXI.Container
 *
 *  Typically, there are two kind of component.
 *  1. topComponent like Scene in the Game.
 *  2. subComponent is a collection contains other elements.
 */
export function component(source: Object): Component {
  const {attributes} = source;

  if (attributes.src) return subComponent(attributes);

  return topComponent(source);
}
