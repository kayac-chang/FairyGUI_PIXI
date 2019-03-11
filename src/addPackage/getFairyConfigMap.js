// @flow

import {cursor, removeComment, decompressToString} from '../util';
import {pipe} from 'ramda';

function toResourceName(packageName) {
  return packageName + '.fui';
}

function toBinaryData(name) {
  return it.getResource(name).data;
}

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

function getFairyConfigMap(packageName: string) {
  return pipe(
      toResourceName,
      toBinaryData,
      decompressToString,
      tokenization
  )(packageName);
}

export {getFairyConfigMap};
