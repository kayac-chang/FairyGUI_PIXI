// @flow
import {component} from './component';
import {image} from './image';
import {movieclip} from './movieclip';
import {graph} from './graph';
import {text} from './text';

import {split} from 'ramda';

/*
 *  source.name is resource type
 *  switch construct function by type
 */
export function construct(source: Object) {
  const func = {
    image, movieclip, graph, text, component,
  }[source.name];

  if (!func) {
    console.error(source);
    throw Error('This resource type not support.');
  }

  return func(source);
}

export function getAtlasName(id, binIndex) {
  return (
    (Number(binIndex) >= 0) ?
      `atlas${binIndex}` :
      `atlas_${split('_', id)[0]}`
  );
}
