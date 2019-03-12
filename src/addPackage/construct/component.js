import {search} from '../../util';
import {map, propEq} from 'ramda';
import {assign} from './assign';

import {Container} from 'pixi.js';

import {construct} from './index';

function component(source) {
  const {attributes} = source;

  if (attributes.src) {
    const comp = it.constructBy(attributes.src);

    return assign(comp, attributes);
  }

  const comp = new Container();

  const {elements} =
      search(propEq('name', 'displayList'), source);

  if (elements) {
    const displayList = map(construct, elements);

    comp.addChild(...displayList);
  }

  return assign(comp, attributes);
}

export {component};
