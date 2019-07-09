import {toPair} from '../../util';
import {radians} from '../../core/physic';

function assign(it, attributes) {
  //  Id
  it.id = (attributes.id) || '';

  //  Name
  it.name = (attributes.name) || '';

  //  Size
  if (attributes.size) {
    const [width, height] = toPair(attributes.size);
    it.width = width;
    it.height = height;

    if (it.filterArea) {
      it.filterArea.width = width;
      it.filterArea.height = height;
    }
  }

  //  Scale
  if (attributes.scale) {
    const [scaleX, scaleY] = toPair(attributes.scale);
    it.scale.set(scaleX, scaleY);
  }

  //  Position
  if (attributes.xy) {
    const [x, y] = toPair(attributes.xy);
    it.position.set(x, y);
  }

  //  Rotation
  if (attributes.rotation) {
    it.rotation = radians(attributes.rotation);
  }

  //  Skew
  if (attributes.skew) {
    const [skewX, skewY] = toPair(attributes.skew);
    it.skew.set(-1 * radians(skewX), radians(skewY));
  }

  //  Anchor
  if (attributes.anchor === 'true') {
    const [pivotX, pivotY] = toPair(attributes.pivot);
    it.anchor.set(pivotX, pivotY);
  }

  //  Alpha
  if (attributes.alpha) {
    it.alpha = Number(attributes.alpha);
  }

  //  Visible
  if (attributes.visible === 'false') {
    it.visible = false;
  }

  // Group
  if (attributes.group) {
    it.group = attributes.group;
  }

  //  Interactive
  it.interactive = false;

  return it;
}

export {assign};
