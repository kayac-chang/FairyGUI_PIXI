import {Text, Container, Graphics, Texture, Rectangle, Sprite} from 'pixi.js';

import {toNumberPair} from '../../util';
import {assign} from './assign';

import {getAtlasName} from './common';

import {
  includes, replace, propSatisfies, reduce,
  split, equals, assoc, pipe, isEmpty,
} from 'ramda';

function placeHolder(width, height) {
  const holder = new Graphics();

  holder.beginFill(0xffffff, 0);
  holder.drawRect(0, 0, width, height);
  holder.endFill();

  return holder;
}

const style = (
    {fontSize, font, bold, italic, color, leading, letterSpacing, align}
) => ({
  align: (align) || 'left',
  fontFamily: (font) || 'Arial',
  fontSize: Number(fontSize),
  fontStyle: (italic) ? 'italic' : 'normal',
  fontWeight: (bold) ? 'bold' : 'normal',
  fill: (color) ? [color] : ['#000000'],
  leading: (leading) ? Number(leading) : 0,
  letterSpacing: (letterSpacing) ? Number(letterSpacing) : 0,
});

const whereID = (predicate) => propSatisfies(predicate, 'id');

function textMesh(attributes) {
  const {text, font} = attributes;

  const config = pipe(
      replace('ui://', ''),

      (target) => it.selectResourcesConfig(whereID(includes(target)))
  )(font);

  const baseTexture = pipe(
      (target) => it.selectTexturesConfig(whereID(equals(target))),

      ({id, binIndex}) => getAtlasName(id, binIndex),

      (atlasName) => it.selectResourcesConfig(whereID(equals(atlasName))),

      ({file}) => it.getResource(file).texture.baseTexture
  )(config.texture);

  const fontConfig = it.getSource(
      split('.', config.file)[0]
  );

  const textureMap = reduce(
      (map, {id, x, y, width, height}) => {
        const frame = new Rectangle(x, y, width, height);
        const texture = new Texture(baseTexture, frame);

        return assoc(id, texture, map);
      }, {}, fontConfig.chars
  );

  const comp = assign(new Container(), attributes);

  Object.defineProperty(comp, 'text', {get: getText, set: setText});

  comp.text = text;

  return comp;

  function getText() {
    return comp._text;
  }

  function setText(text) {
    comp._text = text;
    comp.children = [];

    pipe(
        split(''),
        reduce(
            function(x, char) {
              const texture = textureMap[char];

              if (!isEmpty(texture)) {
                const sprite = new Sprite(textureMap[char]);

                sprite.x = x;

                comp.addChild(sprite);

                x += sprite.width;
              }

              return x;
            }, 0)
    )(text);
  }
}

function normal(attributes) {
  const comp = assign(new Container(), attributes);

  const content = new Text(attributes.text, style(attributes));

  const holder =
      placeHolder(...toNumberPair(attributes.size));

  comp.style = content.style;

  Object.defineProperty(comp, 'text', {get: getText, set: setText});
  // Object.defineProperty(comp.style, 'align', {set: setAlign});

  setAlign(attributes.align);

  comp.addChild(holder, content);
  window.t = comp;

  return comp;

  function setAlign(align) {
    comp.style.align = align;

    if (align === 'right') {
      content.x = holder.width - content.width;
    } else if (align === 'left') {
      content.x = 0;
    }
  }

  function getText() {
    return content.text;
  }

  function setText(text) {
    content.text = text;
  }
}

function text({attributes}) {
  log(attributes);

  if (includes('ui://', attributes.font)) {
    return textMesh(attributes);
  }

  return normal(attributes);
}

export {text};
