// @flow
import {
  Text, Container, extras,
} from 'pixi.js';

const {BitmapText} = extras;

import {toPair} from '../../util';
import {assign} from './assign';
import {placeHolder} from './index';

import {divide} from 'mathjs';

import {includes} from 'ramda';


function style(
  {fontSize, font, bold, italic, color, leading, letterSpacing, align},
) {
  return {
    align: (align) || 'left',
    fontFamily: (font) || 'Arial',
    fontSize: Number(fontSize),
    fontStyle: (italic) ? 'italic' : 'normal',
    fontWeight: (bold) ? 'bold' : 'normal',
    fill: (color) ? [color] : ['#000000'],
    leading: (leading) ? Number(leading) : 0,
    letterSpacing: (letterSpacing) ? Number(letterSpacing) : 0,
  };
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

function bitMapFont(attributes) {
  const {text, customData} = attributes;

  const style = JSON.parse(customData);

  const it = new BitmapText(text, style);

  return assign(it, attributes);
}

/*
 *  Mapping text to PIXI.text or Container
 *
 *  There are two kinds of Text:
 *  1. Normal Text
 *  2. Custom Text Like Text Mesh Pro
 */
function text({attributes}): Text | Container {
  if (includes('ui://', attributes.font)) {
    return bitMapFont(attributes);
  }

  return normal(attributes);
}

export {text};
