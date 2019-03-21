import {component} from './component';
import {image} from './image';
import {movieclip} from './movieclip';
import {graph} from './graph';
import {text} from './text';

function construct(source) {
  return (
    (name) => (
              (name === 'image') ? image(source) :
              (name === 'movieclip') ? movieclip(source) :
              (name === 'graph') ? graph(source) :
              (name === 'text') ? text(source) :
              (name === 'component') ? component(source) :
                  undefined
    )
  )(source.name);
}

export * from './transition';
export {construct};
