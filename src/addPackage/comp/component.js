import {container, byType} from '.';
import {search, toNumberPair} from '../../util';
import {map} from 'ramda';

function setSize(source) {
  const [width, height] = toNumberPair(source.size);
  source.size = {width, height};
  return source;
}

function component(source) {
  let {attributes} = source;

  if (attributes.size) {
    attributes = setSize(attributes);
  }

  const comp = container(attributes);

  const {elements} =
      search(({name}) => name === 'displayList', source);

  const displayList = map(byType, elements);

  comp.addChild(...displayList);

  return comp;
}

export {component};
