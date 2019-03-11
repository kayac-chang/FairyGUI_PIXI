import {__, find, pipe, prop, propEq, split} from 'ramda';
import {xml2js} from 'xml-js';
import {byType} from './comp';

function getComponentName(key) {
  return pipe(
      split('.'),
      prop('0'),
      propEq('id'),
      find(__, it.resourcesConfig),
      prop('name')
  )(key);
}

function getComponentMap([key, source]) {
  const {elements} = xml2js(source);

  const topComponent = byType(elements[0]);

  const compName = getComponentName(key);

  return [compName, topComponent];
}

export {getComponentMap};
