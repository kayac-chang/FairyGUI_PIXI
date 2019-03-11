import {component, image} from '.';

function byType(source) {
  return (
    ({name}) => (
          (name === 'component') ? component(source) :
              (name === 'image') ? image(source) :
                  undefined
    )
  )(source);
}

export {byType};
