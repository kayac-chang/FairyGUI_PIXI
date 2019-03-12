import {component} from './component';
import {image} from './image';

function construct(source) {
  return (
    (name) => (
              (name === 'image') ? image(source) :
              (name === 'component') ? component(source) :
                  undefined
    )
  )(source.name);
}

export {construct};
