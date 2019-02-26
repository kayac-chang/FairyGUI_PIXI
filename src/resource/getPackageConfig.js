// @flow

import {xml2js} from 'xml-js';
import {Rectangle} from 'pixi.js';
import {
  toPairs, assoc, has, propEq, map, split, zipObj, reduce,
  prop, cond, equals, pipe, mergeRight, when, __, find, defaultTo,
} from 'ramda';

function toRectangle(args) {
  return new Rectangle(...args);
}

function getPackageItemType(source: string): string {
  const types = [
    'image', 'swf', 'movieclip', 'sound', 'component', 'font', 'atlas',
  ];

  return defaultTo('misc',
      find(equals(source))(types));
}

function setWidthAndHeight(source) {
  return pipe(
      prop('size'),
      splitToNumber,
      zipObj(['width', 'height']),
      mergeRight(source)
  )(source);
}

function processForImageType(source) {
  return cond([
    [propEq('scale', '9grid'), processFor9Grid],
    [propEq('scale', 'tile'), processForTile],
  ])(source);
}

function processFor9Grid(source) {
  return pipe(
      prop('scale9grid'),
      splitToNumber,
      toRectangle,
      assoc('scale9grid', __, source),

      when(has('gridTile'),
          pipe(
              prop('gridTile'),
              Number,
              assoc('tiledSlices', __, source)))
  )(source);
}

function processForTile(source) {
  return assoc('scaleByTile', true)(source);
}

function splitToNumber(str) {
  return pipe(split(','), map(Number))(str);
}

function getPackageItems({resources}) {
  return reduce(function(list, [type, items]) {
    return list.concat(map(getPackageItem, [...items]));

    function is(str) {
      return () => equals(str, getPackageItemType(type));
    }

    function getPackageItem({_attributes}) {
      const item = assoc('type', getPackageItemType(type))(_attributes);

      return pipe(
          when(has('size'), setWidthAndHeight),
          when(is('image'), processForImageType),
          defaultTo(item)
      )(item);
    }
  }, [], toPairs(resources));
}

export function getPackageConfig(data: string): [] {
  const {packageDescription} = xml2js(data, {compact: true});

  const packageItems = getPackageItems(packageDescription);

  const {id, name} = packageDescription._attributes;

  return [id, name, packageItems];
}

