import {search} from '../../util';
import {
  map, propEq, isEmpty, filter,
  has, pipe, find, prop,
} from 'ramda';

import {assign} from './assign';

import {Container} from 'pixi.js';

import {transition} from './transition';
import {construct} from './index';

function subComponent(attributes) {
  const source = temp.getSource(attributes.src);

  const comp = construct(source);

  return assign(comp, attributes);
}

function topComponent(attributes) {
  const comp = new Container();

  temp.getChild = (name) => comp.getChildByName(name);

  const displaySource =
      search((obj) => obj.name === 'displayList', source).elements;

  if (!isEmpty(displaySource)) {
    const displayElements = map(construct, displaySource);

    comp.addChild(...displayElements);
  }

  pipe(
      search((obj) => obj.name === 'displayList'),
      prop('elements'),
      map(construct),
  )(source);

  const transitions = pipe(
      search((obj) => obj.name === 'transition'),
      (args) => [].concat(args),
      filter(has('elements')),
      map(transition),
  )(source);

  comp.getTransitions = () => transitions;

  comp.getTransition =
      (name) => find(propEq('name', name), transitions);

  return assign(comp, attributes);

}

export function component(source) {
  const {attributes} = source;

  if (attributes.src) return subComponent(attributes);

  return topComponent(attributes);
}
