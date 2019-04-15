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

function subComponent(attributes: Object): Container {
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

function topComponent(source: Object): Container {
  const comp = new Container();

  const displayElements = pipe(
    search(({name}) => name === 'displayList'),
    prop('elements'),
    map(construct),
  )(source);

  comp.addChild(...displayElements);

  temp.getChild = (name) => comp.getChildByName(name);
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

  it.setHeight = function(value) {
    const {y} = it.getBounds();

    it.height = (y < 0) ? value - y : value;
  };

  it.setWidth = function(value) {
    const {x} = it.getBounds();

    it.width = (x < 0) ? value - x : value;
  };

  const maskFunc = ((overflow) => (
    (overflow === 'hidden') ? hidden :
      identity
  ))(source.attributes.overflow);

  maskFunc(it);

  return it;

  function hidden(it) {
    const mask = new Graphics();
    mask.name = '';

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
export function component(source: Object): Container {
  const {attributes} = source;

  if (attributes.src) return subComponent(attributes);

  return topComponent(source);
}
