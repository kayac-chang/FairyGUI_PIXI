export * from './string';
export * from './query';
export * from './convert';

export function nextFrame() {
  return new Promise((r) => requestAnimationFrame(r));
}
