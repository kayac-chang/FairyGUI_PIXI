// @flow

import {propEq, map} from 'ramda';
import {toPair, search} from '../util';

function processForImageType(attributes) {
  return (
    (scale) => (
          (scale === '9grid') ? processFor9Grid(attributes) :
              (scale === 'tile') ? processForTile(attributes) :
                  attributes
    )
  )(attributes.scale);

  function processFor9Grid(attributes) {
    const {scale9grid, gridTile} = attributes;

    attributes.scale9grid = toPair(scale9grid);

    if (gridTile) {
      attributes.tiledSlices = Number(gridTile);
    }

    return attributes;
  }

  function processForTile(attributes) {
    attributes.scaleByTile = true;
    return attributes;
  }
}

function setWidthAndHeight(attributes) {
  const [width, height] = toPair(attributes.size);

  attributes.size = {width, height};

  return attributes;
}

function getPackageItems(packageID, resources) {
  //
  return map(process)(resources);

  function process({name, attributes}) {
    //  Attributes Condition
    if (attributes.size) {
      attributes = setWidthAndHeight(attributes);
    }

    //  Type Condition
    attributes.type = name;

    /*
     *  Package Type:
     *    'image', 'swf', 'movieclip', 'sound', 'index', 'font', 'atlas', 'misc'
     */

    return (
        (attributes.type === 'image') ? processForImageType(attributes):
            (attributes.type === 'font') ? processForFontType(attributes):
                attributes
    );
  }

  function processForFontType(source) {
    source.id = packageID + source.id;
    return source;
  }
}

/*
 * Return all resources config used by this package.
 */
export function getResourcesConfig(json: Object): Array<Object> {
  const packageID = json.elements[0].attributes.id;

  const {elements} = search(propEq('name', 'resources'), json);

  return getPackageItems(packageID, elements);
}

