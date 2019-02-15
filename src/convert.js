// @flow


/**
 * Convert an Uint8Array into a string.
 *
 * @param {Uint8Array} data
 * @return {string}
 */
export function decodeToUTF8(data: Uint8Array) : string {
  return new TextDecoder('utf-8').decode(data);
}

/**
 * Convert a string into a Uint8Array.
 *
 * @param {Uint8Array} data
 * @return {Uint8Array}
 */
export function encodeToUint8(data : string) : Uint8Array {
  return new TextEncoder('utf-8').encode(data);
}
