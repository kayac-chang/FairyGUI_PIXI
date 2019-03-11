// @flow

import {xml2js} from 'xml-js';
import {Rectangle} from 'pixi.js';
import {propEq, map} from 'ramda';

import {toNumberPair, search} from '../util';

// 'image', 'swf', 'movieclip', 'sound', 'comp', 'font', 'atlas', 'misc'

function getPackageItems(resources) {
  return map(process)(resources);

  function process({name, attributes}) {
    attributes.type = name;

    //  Attributes Condition
    if (attributes.size) {
      attributes = setWidthAndHeight(attributes);
    }

    //  Type Condition
    if (attributes.type === 'image') {
      attributes = processForImageType(attributes);
    }

    return attributes;
  }

  function setWidthAndHeight(source) {
    const [width, height] = toNumberPair(source.size);

    source.size = {width, height};

    return source;
  }

  function processForImageType(source) {
    return (
      ({scale}) => (
            (scale === '9grid') ? processFor9Grid(source) :
                (scale === 'tile') ? processForTile(source) :
                    source
      )
    )(source);
  }

  function processFor9Grid(source) {
    const {scale9grid, gridTile} = source;

    source = new Rectangle(...toNumberPair(scale9grid));

    if (gridTile) {
      source.tiledSlices = Number(gridTile);
    }

    return source;
  }

  function processForTile(source) {
    source.scaleByTile = true;
    return source;
  }
}

export function getResourcesConfig(source: string) {
  const json = xml2js(source);

  const {elements} = search(propEq('name', 'resources'), json);

  return getPackageItems(elements);
}

