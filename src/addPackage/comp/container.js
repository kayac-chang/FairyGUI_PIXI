import {Container} from 'pixi.js';

function container({size}) {
  const it = new Container();

  return Object.assign(it, size);
}

export {container};
