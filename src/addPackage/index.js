import {getFairyConfigMap} from './getFairyConfigMap';
import {getTexturesConfig} from './getTexturesConfig';
import {getResourcesConfig} from './getResourcesConfig';

import {select} from '../util';

import {pipe, propEq} from 'ramda';

import {xml2js} from 'xml-js';
import {construct} from './construct';

function addPackage(app, packageName) {
  //
  const xmlSourceMap = pipe(
      getBinaryData,
      getFairyConfigMap
  )(packageName);
  log(xmlSourceMap);

  const resourcesConfig =
      getResourcesConfig(xmlSourceMap['package']);
  log(resourcesConfig);

  const texturesConfig =
      getTexturesConfig(xmlSourceMap['sprites']);
  // log(texturesConfig);

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
      const sourceStr = xmlSourceMap[key];

      const sourceObj = xml2js(sourceStr).elements[0];

      return construct(sourceObj);
    }

    function f() {

    }

    function getSource(key) {
      const sourceStr = xmlSourceMap[key];

      return xml2js(sourceStr).elements[0];
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

