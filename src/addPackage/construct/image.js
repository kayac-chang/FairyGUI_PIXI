import {assign} from './assign';

import {getAtlasName} from './index';

import {string2hex} from '../../core/color';

import {propEq} from 'ramda';

import {Sprite, mesh, Texture, filters, BLEND_MODES} from 'pixi.js';
import {toPair} from '../../util/string';

const {ColorMatrixFilter} = filters;
const {NineSlicePlane} = mesh;

function sprite({id, binIndex, frame}) {
  const atlasName = getAtlasName(id, binIndex);

  const {file} = temp.selectResourcesConfig(propEq('id', atlasName));

  const {scale9grid} = temp.selectResourcesConfig(propEq('id', id));

  const {baseTexture} = temp.getResource(file).texture;

  const texture = new Texture(baseTexture, frame);

  if (scale9grid) {
    const [a, b, c, d] = scale9grid;
    const {width, height} = texture;

    const leftWidth = a;
    const topHeight = b;
    const bottomHeight = height - (b + d);
    const rightWidth = width - (a + c);

    return new NineSlicePlane(
      texture,
      leftWidth, topHeight,
      bottomHeight, rightWidth,
    );
  }

  return new Sprite(texture);
}

/*
 *  Mapping FairyGUI Image Type to PIXI.Sprite or PIXI.mesh.NineSlicePlane
 */
function image(obj) {
  const attributes = obj.attributes;
  const config =
    temp.selectTexturesConfig(propEq('id', attributes.src));

  const it =
    assign(sprite(config), attributes);

  if (attributes.color) {
    it.tint = string2hex(attributes.color);
  }

  if (attributes.filter === 'color') {
    let [
      brightness, contrast, saturate, hue,
    ] = toPair(attributes.filterData);

    const filter = new ColorMatrixFilter();

    if (brightness) {
      filter.brightness(brightness);
    }
    if (contrast) {
      filter.contrast(contrast);
    }
    if (saturate) {
      filter.saturate(saturate);
    }
    if (hue) {
      hue = (hue * 180) - 10;
      filter.hue(hue);
    }

    it.filters = [filter];
  }

  //  Blend Mode
  if (attributes.blend) {
    const blendMode = BLEND_MODES[attributes.blend.toUpperCase()];

    if (attributes.filter) {
      it.filters[0].blendMode = blendMode;
    } else {
      it.blendMode = blendMode;
    }
  }

  return it;
}

export {image};
