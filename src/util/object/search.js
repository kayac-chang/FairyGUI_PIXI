import {curry} from 'ramda';

const search = curry(
    function(predicate, data) {
      const result = recursion(data);
      return result.length === 1 ? result[0] : result;

      function recursion(data, result = []) {
        if (predicate(data)) {
          result.push(data);
        }

        const {elements} = data;
        if (elements && elements.length) {
          for (const element of elements) {
            recursion(element, result);
          }
        }

        return result;
      }
    }
);


export {search};
