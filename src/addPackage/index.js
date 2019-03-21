import {getFairyConfigMap} from './getFairyConfigMap';
import {getTexturesConfig} from './getTexturesConfig';
import {getResourcesConfig} from './getResourcesConfig';
import {fnt2js} from './fnt2js';

import {select} from '../util';

import {
  pipe, propEq, omit, split,
  toPairs, map, fromPairs,
} from 'ramda';
import {xml2js} from 'xml-js';
import {construct} from './construct';

function bySourceType([sourceKey, sourceStr]) {
  const [key, type] = split('.', sourceKey);

  const value = ((type) => (
      (type === 'xml') ? xml2js(sourceStr).elements[0] :
          (type === 'fnt') ? fnt2js(sourceStr) :
              undefined
  ))(type);

  return [key, value];
}

function addPackage(app, packageName) {
  //
  const xmlSourceMap = pipe(
      getBinaryData,
      getFairyConfigMap
  )(packageName);
  // log(xmlSourceMap);

  const resourcesConfig =
      getResourcesConfig(xmlSourceMap['package.xml']);
  // log(resourcesConfig);

  const texturesConfig =
      getTexturesConfig(xmlSourceMap['sprites.bytes']);
  // log(texturesConfig);

  const sourceMap = pipe(
      omit(['package.xml', 'sprites.bytes']),
      toPairs,
      map(bySourceType),
      fromPairs
  )(xmlSourceMap);
  // log(sourceMap);

  return create;

  function create(resName) {
    //  Temp Global
    global.it = {
      getSource,
      constructBy, selectResourcesConfig,
      getResource, selectTexturesConfig,
    };

    const result = constructBy(id(resName));

    result.name = resName;

    delete global.it;

    return result;

    function constructBy(key) {
      return construct(sourceMap[key]);
    }

    function getSource(key) {
      return sourceMap[key];
    }

    function selectResourcesConfig(predicate) {
      return select(predicate, resourcesConfig);
    }

    function selectTexturesConfig(predicate) {
      return select(predicate, texturesConfig);
    }

    function id(resName) {
      return selectResourcesConfig(propEq('name', resName)).id;
    }
  }

  function getBinaryData(packageName) {
    return app.loader.resources[packageName + '.fui'].data;
  }

  function getResource(name) {
    return app.loader.resources[packageName + '@' + name];
  }
}

export {addPackage};

