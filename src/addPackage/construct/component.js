// @flow
import {search} from '../../util';
import {
  map, propEq, filter,
  has, pipe, find, prop,
  identity,
} from 'ramda';

import {assign} from './assign';

import {Container} from 'pixi.js';

import {transition} from './transition';
import {construct} from './index';
import {Button} from './button';

const {defineProperties} = Object;

function subComponent(attributes: Object): Container {
  const source = temp.getSource(attributes.src);

  const mapByExtention = (({extention}) => (
    (extention === 'Button') ? Button(source) :
      identity
  ))(source.attributes);

  const comp = pipe(
    topComponent,
    mapByExtention,
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

  defineProperties(comp,
    {
      'transitions': {
        get: () => transitions,
      },
    },
  );

  comp.getTransition = (name) =>
    find(propEq('name', name))(transitions);

  return assign(comp, source.attributes);
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
