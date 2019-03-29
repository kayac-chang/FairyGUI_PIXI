import {is} from 'ramda';

export function bool(source) {
  if (is(String, source)) return source === 'true';

  return Boolean(source);
}

export function number(source) {
  if (isNaN(source)) return source;

  return Number(source);
}
