// @flow
import {divide, multiply, pi} from 'mathjs';
import {curry} from 'ramda';

export function radians(source) {
  const theta = divide(source, 180);
  return multiply(theta, pi);
}

export function milliseconds(source) {
  return multiply(source, 1000);
}

export const deltaTime = curry(
    function(rate, source) {
      const seconds = divide(source, rate);
      return milliseconds(seconds);
    }
);


