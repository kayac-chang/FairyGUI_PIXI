// @flow

import {Cursor} from '../util';

function executor(result, cursor) {
  const {find, take, moveTo, current} = cursor;

  const key = take(find('|'));

  moveTo(find('|') + 1);

  const size = Number(take(find('|')));

  moveTo(find('|') + 1);

  result[key] = take(current() + size);

  moveTo(current() + size);

  return (find('|') < 0) ? result : executor(result, cursor);
}

export function toSourceMap(source: string) {
  const map = {};
  const cursor = Cursor(source);

  return executor(map, cursor);
}
