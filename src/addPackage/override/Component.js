import {Container} from 'pixi.js';

const {defineProperties} = Object;

export function Component() {
  const it = new Container();

  let _anchorX = 0;
  let _anchorY = 0;

  it.anchor = {
    get x() {
      return _anchorX;
    },
    set x(newX) {
      _anchorX = newX;
      it.pivot.x = newX * it._width;
    },
    get y() {
      return _anchorY;
    },
    set y(newY) {
      _anchorY = newY;
      it.pivot.y = newY * it._height;
    },
    set(newX, newY) {
      it.anchor.x = newX;
      it.anchor.y = newY;
    },
  };

  defineProperties(it, {
    height: {
      get() {
        return it.scale.y * it.getLocalBounds().height;
      },
      set(newHeight) {
        const height = it.getLocalBounds().height;

        const {y} = it.getBounds();

        const value = (y < 0) ? newHeight - y : newHeight;

        if (height !== 0) {
          it.scale.y = value / height;
        } else {
          it.scale.y = 1;
        }

        it._height = newHeight;
      },
    },
    width: {
      get() {
        return it.scale.x * it.getLocalBounds().width;
      },
      set(newWidth) {
        const width = it.getLocalBounds().width;

        const {x} = it.getBounds();

        const value = (x < 0) ? newWidth - x : newWidth;

        if (width !== 0) {
          it.scale.x = value / width;
        } else {
          it.scale.x = 1;
        }

        it._width = newWidth;
      },
    },
  });

  return it;
}
