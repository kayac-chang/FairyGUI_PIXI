// @flow

import {curry} from 'ramda';

/**
 * String Split Util
 *
 * @param {string|RegExp} separator
 * @param {string} source
 * @return {string}
 */
const split = curry(
    function(separator: string | RegExp, source: string) : string {
      return source.split(separator);
    }
);

/**
 * String Cursor Util
 *
 * @param {string} source
 * @param {number} position
 * @return {{
 *    take: (function(number): string),
 *    current: (function(): number),
 *    find: (function(string): number),
 *    moveTo: (function(number): number)}}
 */
function cursor(source: string, position = 0) {
  return {current, find, take, moveTo};

  function find(search: string) {
    return source.indexOf(search, position);
  }

  function take(to: number) {
    return source.substring(position, to);
  }

  function moveTo(next: number) {
    position = next;
    return position;
  }

  function current() {
    return position;
  }
}

export {
  cursor, split,
};
