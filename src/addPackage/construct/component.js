// @flow
import {search} from '../../util';
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

const {defineProperty} = Object;

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

  Object.defineProperties(it, {
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

  if (source.attributes.overflow === 'hidden') {
    hidden(it);
  }

  return it;

  function hidden(it) {
    const mask = new Graphics();
    mask.name = 'mask';

    mask.beginFill(0x000);
    const {x, y, _width, _height} = it;
    mask.drawRect(x, y, _width, _height);
    mask.endFill();

    it.addChild(mask);
    it.mask = mask;

    return it;
  }
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
