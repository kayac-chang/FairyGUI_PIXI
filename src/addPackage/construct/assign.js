import {divide, multiply, pi} from 'mathjs';
import {toNumberPair} from '../../util/string';
import {forEach, isEmpty} from 'ramda';

function radians(num : number) {
  return multiply(divide(num, 180), pi);
}

function assign(it, attributes) {
  //  Name
  if (attributes.name) {
    it.name = attributes.name;
  }

  //  Size
  if (attributes.size) {
    const [width, height] = toNumberPair(attributes.size);
    it.width = width;
    it.height = height;
  }

  //  Position
  if (attributes.xy) {
    const [x, y] = toNumberPair(attributes.xy);
    it.position.set(x, y);
  }

  //  Rotation
  if (attributes.rotation) {
    it.rotation = radians(attributes.rotation);
  }

  //  Scale
  if (attributes.scale) {
    const [scaleX, scaleY] = toNumberPair(attributes.scale);
    it.scale.set(scaleX, scaleY);
  }

  //  Skew
  if (attributes.skew) {
    const [skewX, skewY] = toNumberPair(attributes.skew);
    it.skew.set(-1 * radians(skewX), radians(skewY));
  }

  //  Pivot
  if (attributes.pivot) {
    const [pivotX, pivotY] = toNumberPair(attributes.pivot);
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
