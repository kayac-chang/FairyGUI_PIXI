import {getFairyConfigMap} from './getFairyConfigMap';
import {getSpriteConfig} from './getSpriteConfig';
import {getResourcesConfig} from './getResourcesConfig';
import {getComponentMap} from './getComponentMap';

import {
  pipe, omit, map, toPairs, fromPairs,
} from 'ramda';

function addPackage(app, packageName) {
  //  Temp Global it
  global.it = {};

  it.packageName = packageName;

  it.getResource = function(name) {
    return app.loader.resources[name];
  };

  const xmlSourceMap =
      getFairyConfigMap(packageName);
  // log(xmlSourceMap);

  it.resourcesConfig =
      getResourcesConfig(xmlSourceMap['package.xml']);
  // log(resourcesConfig);

  //  spritesConfig
  it.spritesConfig =
      getSpriteConfig(xmlSourceMap['sprites.bytes']);
  // log(spritesConfig);

  //  componentsMap
  const componentsMap = pipe(
      omit(['sprites.bytes', 'package.xml']),
      toPairs,
      map(getComponentMap),
      fromPairs
  )(xmlSourceMap);
  // log(componentsMap);

  delete global.it;

  return {create};

  function create(resName) {
    return componentsMap[resName];
  }
}

export {addPackage};

