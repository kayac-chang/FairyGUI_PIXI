import {Container} from 'pixi.js';

function toContainer({size}) {
  const it = new Container();

  return Object.assign(it, size);
}

export {
  toContainer,
};
