// @flow

import {propEq, map} from 'ramda';
import {toPair, search} from '../util';

// 'image', 'swf', 'movieclip', 'sound', 'index', 'font', 'atlas', 'misc'


export function getResourcesConfig(json: {}) {
  const packageID = json.elements[0].attributes.id;

  const {elements} = search(propEq('name', 'resources'), json);

  return getPackageItems(elements);

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
      } else if (attributes.type === 'font') {
        attributes = processForFontType(attributes);
      }

      return attributes;
    }

    function processForFontType(source) {
      source.id = packageID + source.id;
      return source;
    }

    function setWidthAndHeight(source) {
      const [width, height] = toPair(source.size);

      source.size = {width, height};

      return source;
    }

    function processForImageType(source) {
      return (({scale}) => (
          (scale === '9grid') ? processFor9Grid(source) :
              (scale === 'tile') ? processForTile(source) :
                  source
      ))(source);
    }

    function processFor9Grid(source) {
      const {scale9grid, gridTile} = source;

      source.scale9grid = toPair(scale9grid);

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
}

