// @flow

import {getFairyConfigMap} from './parse/getFairyConfigMap';
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

import {Application, Container} from 'pixi.js';

function bySourceType([sourceKey, sourceStr]) {
  const [key, type] = split('.', sourceKey);

  const value = {
    xml: xml2js(sourceStr).elements[0],
    fnt: fnt2js(sourceStr),
  }[type];

  return [key, value];
}

/**
 *   >  Analysing Fairy Config File
 *   >  and return a function for create Entities with specify name.
 *
 *   ### Notice:
 *   >  Make sure all Resources used by the package were loaded.
 *   >  This Function use PIXI.Application built-in loader
 *   >  to fetch necessary resources.
 *
 *   ### Usage:
 *   >  This function will fetch that file from loader
 *   >  and return a factory function.
 *
 *   ### Example:
 *   ```
 *   // Suppose your config filename is package1.fui
 *   const create = addPackage(app, 'package1');
 *
 *   // Suppose 'main' is your component name.
 *   const mainComp = create('main');
 *
 *   app.stage.addChild(mainComp);
 *   ```
 *
 * @param {PIXI.Application} app
 * @param {string} packageName
 * @return { function(string): PIXI.Container }
 */
function addPackage(app: Application, packageName: string) {
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

  /**
   * > The Function create can take specify component name,
   * > which you created by fairyGUI Editor
   * > and return the PIXI.Container for that entity.
   *
   * @param {string} resName
   * @return {PIXI.Container}
   */
  function create(resName: string): Container {
    //  Temp Global
    global.it = {
      getSource,
      constructBy, selectResourcesConfig,
      getResource, selectTexturesConfig,
    };

    const result = constructBy(id(resName));

    delete global.it;

    result.name = resName;

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

    function getResource(name) {
      return app.loader.resources[packageName + '@' + name];
    }
  }

  function getBinaryData(packageName) {
    return app.loader.resources[packageName + '.fui'].data;
  }
}

export {addPackage};

