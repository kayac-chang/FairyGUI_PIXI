// @flow
import {
  pipe, split, trim, reduce, cond, equals,
  T, nth, assoc, curry, fromPairs, map, replace,
  max, prop, defaultTo, gt, __, find, has, always,
} from 'ramda';


const pushTo = curry(
    function(obj, [type, attrs]) {
      if (!obj[type]) obj[type] = [];
      obj[type].push(attrs);
      return obj;
    }
);

const assocTo = curry(
    function(obj, [type, attrs]) {
      return assoc(type, attrs, obj);
    }
);

const trimSplit = curry(
    function(reg, val) {
      return pipe(trim, split(reg))(val);
    }
);

/**
 * Parse value to Number
 * from particular object with specify key prop.
 * default return  0
 *
 * @param {string} key
 * @param {object} data
 * @return {number} result || 0
 */
const parseNumberFrom = curry(
    function(key: string, data: {}): number {
      return defaultTo(0)(
          pipe(prop(key), Number)(data));
    }
);

const maxByProp = curry(
    function(prop, data) {
      return pipe(
          map(parseNumberFrom(prop)),
          reduce(max, 0)
      )(data);
    }
);

function attrsToObject([type, ...attrs]) {
  const result = pipe(
      map(
          pipe(
              split('='),
              map(replace(/"/g, '')))),
      fromPairs
  )(attrs);
  return [type, result];
}

function fromPairsToObject(acc, source) {
  return pipe(
      trimSplit(/\s+/),
      attrsToObject,
      cond([
        [pipe(nth(0), equals('char')), pushTo(acc)],
        [T, assocTo(acc)],
      ]),
  )(source);
}

function parseToObj(source) {
  return pipe(
      trimSplit(/\n/),
      reduce(fromPairsToObject, {})
  )(source);
}

function propIsTrue(key, data) {
  return pipe(
      prop(key), equals('true')
  )(data);
}

const {fromCharCode} = String;

const toGlyph = curry(
    function( {lineHeight}, data) {
      const id = pipe(parseNumberFrom('id'), fromCharCode)(data);
      const x = parseNumberFrom('x', data);
      const y = parseNumberFrom('y', data);
      const offsetX = parseNumberFrom('xoffset', data);
      const offsetY = parseNumberFrom('yoffset', data);
      const width = parseNumberFrom('width', data);
      const height = parseNumberFrom('height', data);
      const advance = parseNumberFrom('advance', data);

      const channel = pipe(
          parseNumberFrom('chnl'),
          cond([
            [equals(15), always(4)],
            [equals(1), always(3)],
            [equals(2), always(2)],
            [T, always(1)],
          ])
      )(data);

      if (!lineHeight) {
        lineHeight = offsetY < 0 ? height : (offsetY + height);
      }

      return [id,
        {
          x, y, offsetX, offsetY, width, height, advance, channel,
          lineHeight,
        // texture
        }];
    }
);


function bitmapFont(id, {info, common, char}) {
  const maxCharHeight = maxByProp('height', char);

  const infoSize = parseNumberFrom('size', info);
  const commonLineHeight = parseNumberFrom('lineHeight', common);

  const size = getSize({maxCharHeight, infoSize, commonLineHeight});

  const ttf = has('face')(info);
  const resizable = propIsTrue('resizable', info);
  const colorable = propIsTrue('colorable', info);

  const glyphs = pipe(
      map(toGlyph({
        lineHeight: getLineHeight(),
      })),
      fromPairs
  )(char);

  return {
    id, size, resizable, colorable, ttf, glyphs,
  };

  function getLineHeight() {
    if (ttf) {
      return commonLineHeight;
    } else if (infoSize > 0 && infoSize > commonLineHeight) {
      return infoSize;
    }
  }

  function getSize({maxCharHeight, infoSize, commonLineHeight}) {
    //  defaultTo maxCharHeight
    //  if info.size is not 0 then size = info size
    //  else if common.lineHeight is not 0 then size = common.lineHeight
    const greaterThan0 = gt(__, 0);

    return defaultTo(maxCharHeight,
        find(greaterThan0, [infoSize, commonLineHeight]));
  }
}

export function getBitmapFont(fontId, source) {
  return pipe(
      parseToObj,
      (data) => bitmapFont(fontId, data)
  )(source);
}
