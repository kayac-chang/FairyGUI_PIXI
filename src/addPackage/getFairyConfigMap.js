// @flow

import {cursor, removeComment, decompressToString} from '../util';
import {pipe} from 'ramda';

function tokenization(source: string) : {} {
  const {find, takeTo, moveTo, current} = cursor(source);

  return recursion({});

  function recursion(result) {
    const key = take(find('|'));
    const size = Number(take(find('|')));

    result[key] = take(current() + size);

    moveTo(current() - 1);

    return (find('|') < 0) ? result : recursion(result);
  }

  function take(targetPos) {
    const token = removeComment(takeTo(targetPos));

    moveTo(targetPos + 1);

    return token;
  }
}

function getFairyConfigMap(source: string) {
  return pipe(
      decompressToString,
      tokenization
  )(source);
}

export {getFairyConfigMap};
