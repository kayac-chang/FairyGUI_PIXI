//  @flow

export function cursor(source: string, position = 0) {
  /**
   *  @param {string} search
   *  @return {number}
   */
  function find(search: string) : number {
    return source.indexOf(search, position);
  }

  /**
   *  @param {number} targetPosition
   *  @return {string}
   */
  function takeTo(targetPosition: number) : string {
    return source.substring(current(), targetPosition);
  }

  /**
   *  @param {number} targetPosition
   *  @return {number}
   */
  function moveTo(targetPosition: number) : number {
    position = targetPosition;
    return position;
  }

  /**
   *  @return {number}
   */
  function current() : number {
    return position;
  }

  return {find, takeTo, moveTo, current};
}
