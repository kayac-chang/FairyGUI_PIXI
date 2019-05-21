export function Anchorable(it) {
  let anchorX = 0;
  let anchorY = 0;

  it.anchor = {
    get x() {
      return anchorX;
    },
    set x(newX) {
      anchorX = newX;
      it.pivot.x = newX * it._width;
    },
    get y() {
      return anchorY;
    },
    set y(newY) {
      anchorY = newY;
      it.pivot.y = newY * it._height;
    },
    set(newX, newY) {
      it.anchor.x = newX;
      it.anchor.y = newY;
    },
  };

  return it;
}
