import {is} from 'ramda';

export function bool(source) {
  if (is(String, source)) return source === 'true';

  return Boolean(source);
}
