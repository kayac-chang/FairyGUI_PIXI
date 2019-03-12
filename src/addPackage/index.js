import {getFairyConfigMap} from './getFairyConfigMap';
import {getSpriteConfig} from './getSpriteConfig';
import {getResourcesConfig} from './getResourcesConfig';

import {
  pipe, map, split, propEq, find,
} from 'ramda';

import {Sprite} from 'pixi.js';
import {xml2js} from 'xml-js';
import {construct} from './construct';

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

  const sprites = pipe(
      getSpriteConfig,
      map(toSprite)
  )(xmlSourceMap['sprites.bytes']);
  // log(sprites);

  return create;

  function create(resName) {
    //  Temp Global
    global.it = {constructBy, getSprite};

    const result = constructBy(id(resName));

    result.name = resName;

    delete global.it;

    return result;

    function constructBy(key) {
      const sourceStr = xmlSourceMap[key + '.xml'];

      const sourceObj = xml2js(sourceStr).elements[0];

      return construct(sourceObj);
    }

    function getSprite(key) {
      return sprites[key];
    }

    function id(resName) {
      return find(propEq('name', resName), resourcesConfig).id;
    }
  }

  function toSprite({id, binIndex, frame}) {
    const atlasName = getAtlasName(id, binIndex);

    const {file} = find(propEq('id', atlasName), resourcesConfig);

    const {texture} = getResource(packageName + '@' + file);

    texture.frame = frame;

    return new Sprite(texture);

    function getAtlasName(id, binIndex) {
      return (
          Number(binIndex) >= 0 ?
              `atlas${binIndex}` :
              `atlas_${split('_', id)[0]}`);
    }
  }

  function getBinaryData(packageName) {
    return getResource(packageName + '.fui').data;
  }

  function getResource(name) {
    return app.loader.resources[name];
  }
}

export {addPackage};

