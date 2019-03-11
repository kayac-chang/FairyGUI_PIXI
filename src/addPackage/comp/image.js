import {toNumberPair} from '../../util';

function image({attributes}) {
  const {xy, src, name} = attributes;

  const sprite = it.spritesConfig[src];
  sprite.name = name;

  const [x, y] = toNumberPair(xy);
  sprite.x = x;
  sprite.y = y;

  return sprite;
}

export {image};
