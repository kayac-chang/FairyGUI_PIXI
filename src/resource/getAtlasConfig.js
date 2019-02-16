// @flow
import {Rectangle} from 'pixi.js';

/**
 * Atlas Config Tokenization
 *
 * @param {string} data
 * @return {{}}
 */
export function getAtlasConfig(data: string): {} {
  const [, ...chunks] = data.split(/\n/);

  return chunks.reduce(function(map, chunk) {
    const [itemId, binIndex, x, y, width, height, _rotate]
      = chunk.split(/\s/);

    const atlasName = (Number(binIndex) >= 0) ?
      `atlas${binIndex}` : `atlas_${takeAhead(itemId, '_')}`;

    const frame = new Rectangle(...[x, y, width, height].map(Number));

    const rotate = (_rotate === '1') ? 6 : 0;

    const orig = (rotate !== 0) ?
      new Rectangle(0, 0, width, height) : undefined;

    map[itemId] = {atlasName, frame, rotate, orig};

    return map;
  }, {});

  function takeAhead(source: string, separator: string) {
    return source.split(separator)[0];
  }
}
