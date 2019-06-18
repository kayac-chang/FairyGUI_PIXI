// @flow

/*
 * Convert an Uint8Array into a string.
 */
export function decodeToUTF8(data) {
  return new TextDecoder('utf-8').decode(data);
}

/*
 * Convert a string into a Uint8Array.
 */
export function encodeToUint8(data) {
  return new TextEncoder('utf-8').encode(data);
}
