//  @flow

/*
 * find(search: string): number
 *   Find the specify word position in the source.
 *
 * takeTo(targetPosition: number): string
 *   Pick up a token from current position to target position.
 *
 * moveTo(targetPosition: number): number
 *   Change current position to target position.
 *
 * current(): number
 *   Return the current position.
 */

/*
 * Function used to traverse source string for complex string multiplication.
 * Return an Interface Function with some useful function below.
 *
 * find(search: string): number
 *   Find the specify word position in the source.
 *
 * takeTo(targetPosition: number): string
 *   Pick up a token from current position to target position.
 *
 * moveTo(targetPosition: number): number
 *   Change current position to target position.
 *
 * current(): number
 *   Return the current position.
 */
export function cursor(source, position = 0) {
  function find(search) {
    return source.indexOf(search, position);
  }

  function takeTo(targetPosition) {
    return source.substring(current(), targetPosition);
  }

  function moveTo(targetPosition) {
    position = targetPosition;
    return position;
  }

  function current() {
    return position;
  }

  return {find, takeTo, moveTo, current};
}
