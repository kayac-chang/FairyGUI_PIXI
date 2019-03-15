import {Text, Container, Graphics} from 'pixi.js';

import {toNumberPair} from '../../util';
import {assign} from './assign';

import {
  includes, replace, propSatisfies, split,
  propEq,
} from 'ramda';

function style({
  fontSize, font, bold, italic, color, leading, letterSpacing, align,
}) {
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

function text({attributes}) {
  log(attributes);

  const {text, size, font} = attributes;

  const comp = assign(new Container(), attributes);

  const holder = new Graphics();
  const [width, height] = toNumberPair(size);

  holder.beginFill(0xffffff, 0);
  holder.drawRect(0, 0, width, height);
  holder.endFill();

  if (includes('ui://', font)) {
    const id = replace('ui://', '')(font);

    const config =
        it.selectResourcesConfig(propSatisfies(includes(id), 'id'));

    log(config);

    const {file, chars} = it.getSource(split('.', config.file)[0]);
    log({file, chars});

    const {binIndex} = it.selectTexturesConfig(propEq('id', config.texture));

    log(textureConfig);

    const obj = it.getResource();
    log(obj);

    debugger;
  }

  const content = new Text(text, style(attributes));

  log(content);

  comp.addChild(holder, content);

  return comp;
}

export {text};
