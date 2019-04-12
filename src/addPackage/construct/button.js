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
      .on('pointerup', onButtonUp)
      .on('pointerover', onButtonOver);

    onButtonUp();

    return it;

    function getImage({attributes, elements}) {
      const image = it.getChildByName(attributes.name);

      const indexes = toPair(
        find(({name}) => name === 'gearDisplay', elements)
          .attributes
          .pages,
      );

      return reduce((pages, index) => {
        pages[index] = image;
        return pages;
      }, {}, indexes);
    }

    function setState(state) {
      it.setChildIndex(pages[state], it.children.length - 1);
    }

    function onButtonUp() {
      setState(0);
      it.emit('buttonUp');
    }

    function onButtonDown() {
      setState(1);
      it.emit('buttonDown');
    }

    function onButtonOver() {
      setState(2);
      it.emit('buttonOver');
    }
  },
);
