// @flow
import {component} from './component';
import {image} from './image';
import {movieclip} from './movieclip';
import {graph} from './graph';
import {text} from './text';

import {split} from 'ramda';
import {Graphics, ObservablePoint} from 'pixi.js';
import {assign} from './assign';
import {Component} from '../override/Component';

const {defineProperties} = Object;

/*
 *  source.name is resource type
 *  switch construct function by type
 */
export function construct(source) {
  const func = {
    image, movieclip, graph, text, component, group,
  }[source.name];

  if (!func) {
    console.error(source);
    throw Error('This resource type not support.');
  }

  return func(source);
}

function group({attributes}) {
  const it = assign(Component(), attributes);

  let [x, y] = [it.x, it.y];

  it.position = new ObservablePoint(whenPosChange, it, x, y);

  it.list = [];

  let visible = it.visible;

  defineProperties(it, {
    visible: {
      get() {
        return visible;
      },
      set(flag) {
        visible = flag;

        whenVisibleChange(flag);
      },
    },
  });

  return it;

  function whenPosChange() {
    const [diffX, diffY] = [it.x - x, it.y - y];

    it.list
      .forEach((element) => {
        element.position.x += diffX;
        element.position.y += diffY;
      });

    [x, y] = [it.x, it.y];
  }

  function whenVisibleChange(flag) {
    it.list
      .forEach((element) => element.visible = flag);
  }
}

export function getAtlasName(id, binIndex) {
  return (
    (Number(binIndex) >= 0) ?
      `atlas${binIndex}` :
      `atlas_${split('_', id)[0]}`
  );
}

export function placeHolder(width, height) {
  const holder = new Graphics();

  holder.beginFill(0xffffff, 0);
  holder.drawRect(0, 0, width, height);
  holder.endFill();

  return holder;
}
