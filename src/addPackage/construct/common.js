import {split} from 'ramda';

export function getAtlasName(id, binIndex) {
  return (
      (Number(binIndex) >= 0) ?
          `atlas${binIndex}` :
          `atlas_${split('_', id)[0]}`
  );
}
