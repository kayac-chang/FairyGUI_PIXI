// @flow

/**
 * Take one word From sentence with RegExp
 *
 * @param {RegExp} regexp
 * @param {string} source
 * @return {string} word
 */
export function take(regexp: RegExp, source: string) : string {
  return RegExp(regexp).exec(source)[0];
}

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
export function cursor(source: string, position = 0) {
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
