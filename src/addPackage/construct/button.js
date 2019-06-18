import {pipe, map, curry, reduce, find, mergeAll} from 'ramda';
import {toPair, search} from '../../util';

export const Button = curry(
  function(source, it) {
    it.interactive = true;
    it.buttonMode = true;

    it
      .on('pointerdown', onButtonDown)
      .on('pointerover', onButtonOver)
      .on('pointerup', onButtonUp)
      .on('pointerout', onButtonOut)
      .on('pointerupoutside', onButtonUpOutSide);

    const pages = pipe(
      search(({name}) => name === 'image'),
      (arr) => [].concat(arr),
      map(getImage),
      mergeAll,
    )(source);

    setState(0);

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

    function onButtonUp(event) {
      setState(2);
      it.emit('buttonUp');
    }

    function onButtonDown(event) {
      setState(1);
      it.emit('buttonDown');
    }

    function onButtonOver(event) {
      setState(2);
      it.emit('buttonOver');
    }

    function onButtonOut(event) {
      setState(0);
      it.emit('buttonOut');
    }

    function onButtonUpOutSide(event) {
      setState(0);
      it.emit('buttonUpOutSide');
    }
  },
);
