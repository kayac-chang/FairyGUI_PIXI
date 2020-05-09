// @flow
import { search, toPair } from "../../util";
import { map, filter, has, pipe, find, prop, identity } from "ramda";

import { assign } from "./assign";

import { BLEND_MODES, filters, Graphics } from "pixi.js";
import { Component } from "../override/Component";

import { transition } from "./transition";
import { construct } from "./index";
import { Button } from "./button";

const { ColorMatrixFilter } = filters;

function subComponent(attributes) {
  const source = temp.getSource(attributes.src);

  const mapByExtension = (({ extention }) =>
    extention === "Button" ? Button(source) : identity)(source.attributes);

  const comp = pipe(topComponent, mapByExtension)(source);

  //  Filter
  if (attributes.filter === "color") {
    let [brightness, contrast, saturate, hue] = toPair(attributes.filterData);

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
      filter.hue(hue * 180 - 10);
    }

    comp.filters = [filter];
  }

  //  Blend Mode
  if (attributes.blend) {
    const blendMode = BLEND_MODES[attributes.blend.toUpperCase()];

    if (attributes.filter) {
      comp.filters.forEach((filter) => (filter.blendMode = blendMode));
    } else {
      comp.blendMode = blendMode;
    }
  }

  return assign(comp, attributes);
}

function topComponent(source) {
  const comp = new Component();

  const displayElements = pipe(
    search(({ name }) => name === "displayList"),
    prop("elements"),
    map(construct)
  )(source);

  displayElements
    .filter(({ group }) => group)
    .forEach((element) => {
      displayElements.find(({ id }) => id === element.group).list.push(element);
    });

  comp.addChild(...displayElements);

  temp.getChild = (_id) => {
    const displayList = pipe(
      search(({ name }) => name === "displayList"),
      prop("elements")
    )(source);

    const target = find(({ attributes }) => attributes.id === _id)(displayList);

    return comp.getChildByName(target.attributes.name);
  };

  const _transitions = pipe(
    search(({ name }) => name === "transition"),
    (args) => [].concat(args),
    filter(has("elements")),
    map(transition)
  )(source);

  if (_transitions.length > 0) {
    comp.transition = _transitions.reduce((obj, tran) => {
      obj[tran.name] = tran;
      return obj;
    }, {});
  }

  const it = assign(comp, source.attributes);
  it.scale.set(1, 1);

  if (source.attributes.mask) {
    const mask = temp.getChild(source.attributes.mask);
    const comp = JSON.parse(JSON.stringify(it.getLocalBounds()));

    if (source.attributes.reversedMask === "true") {
      const reversedMask = new Graphics();
      drawReversedMask(comp, mask, reversedMask);

      it.addChild(reversedMask);
      it.mask = reversedMask;

      it.updateMask = function ({ x, y, width, height }) {
        if (width !== undefined) {
          mask.x -= width - mask.width;
          mask.width = width;
        }
        if (height !== undefined) {
          mask.y -= height - mask.height;
          mask.height = height;
        }
        if (x !== undefined) mask.x = x;
        if (y !== undefined) mask.y = y;

        drawReversedMask(comp, mask, reversedMask);
      };
    } else {
      it.mask = mask;

      it.updateMask = function ({ x, y, width, height }) {
        if (x !== undefined) mask.x = x;
        if (y !== undefined) mask.y = y;
        if (width !== undefined) mask.width = width;
        if (height !== undefined) mask.height = height;
      };
    }
  }

  if (source.attributes.overflow === "hidden") {
    hidden(source.attributes);
  }

  return it;

  function hidden(attributes) {
    const mask = new Graphics();
    mask.name = "mask";

    mask.beginFill(0x000);

    const [width, height] = toPair(attributes.size);
    const [x, y] = toPair(attributes.xy || "0,0");

    mask.drawRect(x, y, width, height);
    mask.endFill();

    it.addChild(mask);
    it.mask = mask;

    it._addChild = it.addChild;

    it.addChild = function (...args) {
      it._addChild(...args);
      it.setChildIndex(mask, it.children.length - 1);
    };

    return it;
  }
}

function drawReversedMask(comp, mask, it) {
  const holeX = Math.max(0, mask.x);
  const holeY = Math.max(0, mask.y);
  const holeW = Math.min(
    comp.width,
    mask.x >= 0 ? mask.width : mask.width + mask.x
  );
  const holeH = Math.min(
    comp.height,
    mask.y >= 0 ? mask.height : mask.height + mask.y
  );

  it.clear();

  return it
    .beginFill(0xffff0b)
    .drawRect(0, 0, comp.width, comp.height)
    .beginHole()
    .drawRect(holeX, holeY, holeW, holeH)
    .endHole()
    .endFill();
}

/*
 *  Mapping FairyGUI component Type to PIXI.Container
 *
 *  Typically, there are two kind of component.
 *  1. topComponent like Scene in the Game.
 *  2. subComponent is a collection contains other elements.
 */
export function component(source) {
  const { attributes } = source;

  if (attributes.src) return subComponent(attributes);

  return topComponent(source);
}
