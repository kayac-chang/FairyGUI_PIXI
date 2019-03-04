import {
  decompress, getAtlasConfig, toFairyConfig, getPackageConfig,
} from './index';

function toUIPackage(fairyConfig) {
  // const {log} = console;
  //  Atlas Configs
  const atlasConfig = getAtlasConfig(fairyConfig['sprites.bytes']);

  //  packageId, packageName, packageItems
  const [, , packageItems] =
          getPackageConfig(fairyConfig['package.xml']);

  //  BitmapFonts

  return {
    atlasConfig,
    packageItems,
  };
}


function addPackage(getResource, packageName) {
  const binary = getResource(packageName).data;
  const source = decompress(binary);
  return (
    toFairyConfig(source)
        .then(toUIPackage)
  );
}

export {addPackage};
