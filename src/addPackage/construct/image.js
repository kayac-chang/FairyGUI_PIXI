import {assign} from './assign';

import {test, replace, when, pipe} from 'ramda';

function colorHex(str: string) : Number {
  return when(
      test(/^#([0-9a-f]{3}){1,2}$/i),
      pipe(
          replace('#', '0x'), Number
      )
  )(str);
}

function image({attributes}) {
  const sprite = assign(
      it.getSprite(attributes.src),
      attributes
  );

  if (attributes.color) {
    sprite.tint = colorHex(attributes.color);
  }

  return sprite;
}

export {image};
