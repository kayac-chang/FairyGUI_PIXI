
import {curry} from 'ramda';

const {log} = console;

const create = curry(
    function(compMap, resName) {
      const compData = compMap[resName];

      log(compData);

      debugger;

      return {};
    }
);

export {
  create,
};
