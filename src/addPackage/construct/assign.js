import {toPair, Radians} from '../../util';
import {forEach, isEmpty} from 'ramda';

function assign(it, attributes) {
  //  Name
  if (attributes.name) {
    it.name = attributes.name;
  }

  //  Size
  if (attributes.size) {
    const [width, height] = toPair(attributes.size);
    it.width = width;
    it.height = height;
  }

  //  Position
  if (attributes.xy) {
    const [x, y] = toPair(attributes.xy);
    it.position.set(x, y);
  }

  //  Rotation
  if (attributes.rotation) {
    it.rotation = Radians(attributes.rotation);
  }

  //  Scale
  if (attributes.scale) {
    const [scaleX, scaleY] = toPair(attributes.scale);
    it.scale.set(scaleX, scaleY);
  }

  //  Skew
  if (attributes.skew) {
    const [skewX, skewY] = toPair(attributes.skew);
    it.skew.set(-1 * Radians(skewX), Radians(skewY));
  }

  //  Pivot
  if (attributes.pivot) {
    const [pivotX, pivotY] = toPair(attributes.pivot);
    it.pivot.set(pivotX, pivotY);

    //  Anchor
    if (attributes.anchor === 'true') {
      if (isEmpty(it.children)) {
        it.anchor.set(pivotX, pivotY);
      } else {
        forEach((it) =>
          it.anchor && it.anchor.set(pivotX, pivotY)
        )(it.children);
      }
    }
  }

  //  Alpha
  if (attributes.alpha) {
    it.alpha = Number(attributes.alpha);
  }

  //  Visible
  if (attributes.visible === 'false') {
    it.visible = false;
  }

  //  Interactive
  it.interactive = attributes.touchable !== 'false';

  return it;
}

export {assign};
