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


