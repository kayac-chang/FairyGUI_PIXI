import {search} from '../../util';
import {
  map, propEq, isEmpty, filter,
  has, pipe, find,
} from 'ramda';

import {assign} from './assign';

import {Container} from 'pixi.js';

import {transition} from './transition';
import {construct} from './index';

export function component(source) {
  const {attributes} = source;

  if (attributes.src) {
    const comp = it.constructBy(attributes.src);

    return assign(comp, attributes);
  }

  const comp = new Container();
  it.getChild = (name) => comp.getChildByName(name);

  const displaySource =
      search(propEq('name', 'displayList'), source).elements;

  if (!isEmpty(displaySource)) {
    const displayList = map(construct, displaySource);

    comp.addChild(...displayList);
  }

  const transitions = pipe(
      search(propEq('name', 'transition')),
      (args) => [].concat(args),
      filter(has('elements')),
      map(transition),
  )(source);

  comp.getTransitions = () => transitions;

  comp.getTransition =
      (name) => find(propEq('name', name), transitions);

  return assign(comp, attributes);
}
