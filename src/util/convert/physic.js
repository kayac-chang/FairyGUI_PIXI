// @flow
import {divide, multiply, pi as PI} from 'mathjs';
import {curry} from 'ramda';

export function Radians(source: number): number {
  const theta = divide(source, 180);
  return multiply(theta, PI);
}

export function Milliseconds(source: number): number {
  return multiply(source, 1000);
}

export const toDeltaTime = curry(
    function(rate: number, source: number) {
      const seconds = divide(source, rate);
      return Milliseconds(seconds);
    }
);

export function position(x, y) {
  return {x, y};
}

export function size(width, height) {
  return {width, height};
}

export function scale(x, y) {
  return {x, y};
}

export function alpha(alpha) {
  return {alpha};
}

export function rotation(_rotation) {
  const rotation = Radians(_rotation);
  return {rotation};
}

export function skew(_x, _y) {
  return {
    x: -1 * Radians(_x),
    y: Radians(_y),
  };
}

