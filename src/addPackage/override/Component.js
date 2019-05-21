import {Container} from 'pixi.js';
import {divide} from 'mathjs';
import {Anchorable} from './Anchor';

const {defineProperties} = Object;

export function Component() {
  const it = new Container();

  Anchorable(it);

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
          it.scale.y = divide(value, height);
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
          it.scale.x = divide(value, width);
        } else {
          it.scale.x = 1;
        }

        it._width = newWidth;
      },
    },
  });

  return it;
}
