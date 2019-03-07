//  @flow

export function Cursor(source: string, position = 0) {
  /**
   *  @param {string} search
   *  @return {number}
   */
  function find(search: string) : number {
    return source.indexOf(search, position);
  }

  /**
   *  @param {number} to
   *  @return {string}
   */
  function take(to: number) : string {
    return source.substring(position, to);
  }

  /**
   *  @param {number} next
   *  @return {number}
   */
  function moveTo(next: number) : number {
    position = next;
    return position;
  }

  /**
   *  @return {number}
   */
  function current() : number {
    return position;
  }

  return {find, take, moveTo, current};
}
