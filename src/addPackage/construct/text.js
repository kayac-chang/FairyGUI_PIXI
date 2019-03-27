import {Text, Container, Graphics, Texture, Rectangle, Sprite} from 'pixi.js';

import {toPair} from '../../util';
import {assign} from './assign';

import {getAtlasName} from './common';

import {divide} from 'mathjs';

import {
  includes, replace, propSatisfies, reduce,
  split, equals, assoc, pipe, isEmpty, map,
  sum, prop,
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
  Object.defineProperty(comp, 'align', {get: getAlign, set: setAlign});

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
        map(
            (char) => {
              const texture = textureMap[char];

              if (isEmpty(texture)) return;

              const sprite = new Sprite(textureMap[char]);
              comp.addChild(sprite);
              return sprite;
            }
        )
    )(text);

    setAlign(attributes.align);
  }

  function getAlign() {
    return attributes.align;
  }

  function setAlign(align) {
    attributes.align = align;

    const {children} = comp;

    const totalWidth = pipe(map(prop('width')), sum)(children);

    const [compWidth] = toPair(attributes.size);

    const startPoint = {
      right: compWidth - totalWidth,
      left: 0,
      center: divide(compWidth - totalWidth, 2),
    }[align];

    reduce(
        function(x, sprite) {
          sprite.x = x;
          x += sprite.width;
          return x;
        }
        , startPoint, children);
  }
}

function normal(attributes) {
  const content = new Text(attributes.text, style(attributes));

  const holder =
      placeHolder(...toPair(attributes.size));

  const comp = assign(new Container(), attributes);
  Object.defineProperty(comp, 'text', {get: getText, set: setText});
  Object.defineProperty(comp, 'align', {get: getAlign, set: setAlign});

  setAlign(attributes.align);

  comp.addChild(holder, content);

  return comp;

  function getAlign() {
    return content.style.align;
  }

  function setAlign(align = 'left') {
    content.style.align = align;

    content.x = {
      right: holder.width - content.width,
      left: 0,
      center: divide(holder.width - content.width, 2),
    }[align];
  }

  function getText() {
    return content.text;
  }

  function setText(text) {
    content.text = text;
  }
}

function text({attributes}) {
  if (includes('ui://', attributes.font)) {
    return textMesh(attributes);
  }

  return normal(attributes);
}

export {text};
