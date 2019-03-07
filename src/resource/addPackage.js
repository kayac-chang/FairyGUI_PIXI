import {xml2js} from 'xml-js';

const {log} = console;

import {toNumberPair} from '../util';

import {
  decompressToString, toSourceMap, toSpriteSheetsConfig,
  toPackageConfig, create,
} from './index';

import {
  pipe, omit, map, find, propEq, toPairs,
  split, prop, fromPairs, __, evolve,
} from 'ramda';

import {Sprite} from 'pixi.js';
import {toContainer} from '../component';


function addPackage(getResource, packageName) {
  const binary = getResource(packageName + '.fui').data;
  const source = decompressToString(binary);

  const sourceMap = toSourceMap(source);

  log(sourceMap);

  //  packageId, packageName, resourcesConfig
  const [, , resourcesConfig] =
      toPackageConfig(sourceMap['package.xml']);

  log(resourcesConfig);

  //  spriteMapping
  const getSprite = pipe(
      toSpriteSheetsConfig,
      map(toSprite),
      toSpriteFunc
  )(sourceMap['sprites.bytes']);

  //  componentsMap
  const componentsMap =
      pipe(
          omit(['sprites.bytes', 'package.xml']),
          toPairs,
          map(toComponentMap),
          fromPairs
      )(sourceMap);

  log(componentsMap);

  return create(componentsMap);

  function toSpriteFunc(spriteList) {
    return pipe(
        propEq('id'),
        find(__, spriteList),
        prop('sprite')
    );
  }

  function toSprite({id, atlas, frame}) {
    const {file} = find(propEq('id', atlas))(resourcesConfig);
    const {texture} = getResource(packageName + '@' + file);

    texture.frame = frame;

    const sprite = new Sprite(texture);

    return {id, sprite};
  }

  function toComponentMap([key, source]) {
    const compName = pipe(
        split('.'),
        prop('0'),
        propEq('id'),
        find(__, resourcesConfig),
        prop('name')
    )(key);

    const {elements} = xml2js(source);

    const value = toHierarchyTree(elements[0]);

    return [compName, value];
  }

  function component({attributes: preAttr, elements}) {
    const attributes = evolve({
      size,
    })(preAttr);

    const displayList = pipe(
        prop('0'),
        prop('elements'),
        map(toHierarchyTree)
    )(elements);

    const comp = toContainer(attributes);

    comp.addChild(...displayList);

    return comp;

    function size(source) {
      const [width, height] = toNumberPair(source);
      return {width, height};
    }
  }

  function image({attributes}) {
    const {xy, src, name} =
        evolve({
          xy: toPosition,
          src: getSprite,
        })(attributes);

    return Object.assign(src, {name}, xy);

    function toPosition(source) {
      const [x, y] = toNumberPair(source);
      return {x, y};
    }
  }

  function toHierarchyTree(source) {
    return (
      (type) => (
            (type === 'component') ? component(source) :
            (type === 'image') ? image(source) :
            undefined
      )
    )(source.name);
  }
}

export {addPackage};
