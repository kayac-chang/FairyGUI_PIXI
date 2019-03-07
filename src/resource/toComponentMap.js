
import {xml2js} from 'xml-js';

function toComponentMap(source) {
  return xml2js(source, {compact: true});
}

export {
  toComponentMap,
};
