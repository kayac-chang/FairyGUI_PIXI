import {pipe, map, curry, reduce, find, mergeAll} from 'ramda';
import {toPair, search} from '../../util';

export const Button = curry(
  function(source: Object, it) {
    it.interactive = true;
    it.buttonMode = true;

    const pages = pipe(
      search(({name}) => name === 'image'),
      (arr) => [].concat(arr),
      map(getImage),
      mergeAll,
    )(source);

    it
      .on('pointerdown', onButtonDown)
      .on('pointerup', onButtonUp);

    onButtonUp();

    return it;

    function getImage({attributes, elements}) {
      const image = it.getChildByName(attributes.name);

      const indexes = toPair(
        find(({name}) => name === 'gearDisplay', elements)
          .attributes.pages,
      );

      return reduce((pages, index) => {
        pages[index] = image;
        return pages;
      }, {}, indexes);
    }

    function onButtonUp() {
      const state = 0;

      it.setChildIndex(pages[state], it.children.length - 1);
    }

    function onButtonDown() {
      const state = 1;

      it.setChildIndex(pages[state], it.children.length - 1);
    }
  },
);
