// @flow

import {xml2js} from 'xml-js';
import {Rectangle} from 'pixi.js';

function getPackageItemType(source: string) {
  return ['image', 'swf', 'movieclip', 'sound', 'component', 'font', 'atlas']
      .includes(source) ? source : 'misc';
}

export function getPackageConfig(data: string) {
  const {packageDescription} = xml2js(data, {compact: true});

  const {id, name} = packageDescription._attributes;

  const packageItems = Object.entries(packageDescription.resources)
      .reduce(function(list, [key, _items]) {
        const type = getPackageItemType(key);

        const items = [].concat(_items).map(function(item) {
          const packageItem = {};

          packageItem.id = item._attributes['id'];
          packageItem.name = item._attributes['name'];
          packageItem.file = item._attributes['file'];

          const size = item._attributes['size'];
          if (size) {
            const [width, height] = size.split(',').map(Number);
            packageItem.width = width;
            packageItem.height = height;
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
