import {
  decompress, getAtlasConfig, getBitmapFont, getFairyConfig, getPackageConfig,
} from './index';
import {filter, fromPairs, map, pipe, propEq} from 'ramda';

export function addPackage(loader, resKey) {
  const buf = loader.resources[resKey].data;
  const data = decompress(buf);
  return getFairyConfig(data)
      .then(function(fairyConfig) {
        // log(fairyConfig);
        //  Atlas Configs
        getAtlasConfig(fairyConfig['sprites.bytes']);
        //  packageId, packageName, packageItems
        const [packageId, packageName, packageItems] =
            getPackageConfig(fairyConfig['package.xml']);

        //  BitmapFonts
        const bitmapFonts = pipe(
            filter(propEq('type', 'font')),
            map(function(item) {
              const id = `ui://${packageId}${item.id}`;
              return [id, getBitmapFont(id, fairyConfig[`${item.id}.fnt`])];
            }),
            fromPairs
        )(packageItems);

        return {
          packageId,
          packageName,
          packageItems,
          bitmapFonts,
        };
      });
}
