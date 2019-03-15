import {filter, curry} from 'ramda';

const select = curry(
    function(predicate, target) {
      const result = filter(predicate, target);

      return (
          (result.length === 1) ? result[0] : result
      );
    }
);

export {select};
