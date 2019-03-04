// @flow

import {cursor} from '../util';

/**
 * Fairy GUI Config Tokenization
 *
 * @param {string} data
 * @return {Promise}
 */
export function toFairyConfig(data: string): Promise {
  const config = {};

  const {current, find, take, moveTo} = cursor(data);

  return new Promise(function executor(resolve) {
    setTimeout(function() {
      const key = take(find('|'));

      moveTo(find('|') + 1);

      const size = Number(take(find('|')));

      moveTo(find('|') + 1);

      config[key] = take(current() + size);

      moveTo(current() + size);

      return (find('|') < 0) ? resolve(config) : executor(resolve);
    });
  });
}
