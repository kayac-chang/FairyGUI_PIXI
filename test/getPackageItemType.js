// @flow

//  Import =========================================================
import {find, equals} from 'ramda';

//  Data =========================================================

const types = [
  'image', 'swf', 'movieclip', 'sound', 'component', 'font', 'atlas',
];

//  Function =========================================================


/**
 * Check the PackageItem's Type,
 * If doesn't match then return 'misc' type.
 *
 * @param { {type:string} } item
 * @return {string}
 */
function getTypeFrom({type}: {type:string}) : string {
  if (!type) throw new TypeError(`parameter {item} must be PackageItem.`);

  return find(equals(type), types) || 'misc';
}

//  Export =========================================================
export {
  getTypeFrom,
};
