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
interface Cursor {
  find(search: string): number;
  takeTo(targetPosition: number): string;
  moveTo(targetPosition: number): number;
  current(): number;
}

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
export function cursor(source: string, position = 0): Cursor {
  function find(search: string) : number {
    return source.indexOf(search, position);
  }

  function takeTo(targetPosition: number) : string {
    return source.substring(current(), targetPosition);
  }

  function moveTo(targetPosition: number) : number {
    position = targetPosition;
    return position;
  }

  function current() : number {
    return position;
  }

  return {find, takeTo, moveTo, current};
}
