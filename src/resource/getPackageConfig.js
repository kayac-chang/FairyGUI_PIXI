// @flow

import {xml2js} from 'xml-js';
import {Rectangle} from 'pixi.js';
import {toPairs, when, has, clone, map, split, prop, assoc, __, zipObj, pipe, mergeRight} from 'ramda';

function getPackageItemType(source: string): string {
  return ['image', 'swf', 'movieclip', 'sound', 'component', 'font', 'atlas']
      .includes(source) ? source : 'misc';
}

export function getPackageConfig(data: string): {} {
  const {packageDescription} = xml2js(data, {compact: true});

  const {id, name} = packageDescription._attributes;

  const packageItems = toPairs(packageDescription.resources)
      .reduce(function(list, [key, _items]) {
        const type = getPackageItemType(key);

        const items = [..._items].map(function({_attributes}) {
          const packageItem = clone(_attributes);

          when(
              has('size'), toWidthAndHeight
          )(packageItem);

          function toWidthAndHeight(item) {
            return pipe(
                prop('size'),
                split(','),
                map(Number),
                zipObj(['width', 'height']),
                mergeRight(item)
            )(item);
          }

          if (type === 'image') {
            if (item._attributes['scale'] === '9grid') {
              if (item._attributes['scale9grid']) {
                const arr = item._attributes['scale9grid'].split(',');
                packageItem.scale9Grid = new Rectangle(...arr.map(Number));

                if (item._attributes['gridTile']) {
                  packageItem.tiledSlices =
                      Number(item._attributes['gridTile']);
                }
              }
            } else if (item._attributes['scale'] === 'tile') {
              packageItem.scaleByTile = true;
            }
          }

          return packageItem;
        });

        return list.concat(items);
      }, []);

  return {id, name, packageItems};
}
