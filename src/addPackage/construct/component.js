import {search} from '../../util';
import {map, propEq, isEmpty} from 'ramda';

import {assign} from './assign';

import {Container} from 'pixi.js';

import {construct, transition} from './index';

function component(source) {
  const {attributes} = source;

  if (attributes.src) {
    const comp = it.constructBy(attributes.src);

    return assign(comp, attributes);
  }

  const comp = new Container();
  it.comp = comp;

  const displaySource =
      search(propEq('name', 'displayList'), source).elements;

  if (!isEmpty(displaySource)) {
    const displayList = map(construct, displaySource);

    comp.addChild(...displayList);
  }

  let transitionSource =
      search(propEq('name', 'transition'), source);

  if (!isEmpty(transitionSource)) {
    if (!transitionSource.length) {
      transitionSource = [transitionSource];
    }
    map(transition, transitionSource);
  }

  return assign(comp, attributes);
}

export {component};
