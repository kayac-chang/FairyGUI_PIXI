import {Zlib} from 'zlibjs/bin/rawinflate.min';
import {decodeToUTF8} from '../convert';

/**
 * DeCompress the ArrayBuffer To UTF-8 String
 *
 * @param {ArrayBuffer} buffer
 * @return {string} decompressed
 */
export function decompress(buffer: ArrayBuffer): string {
  const decompressData = new Zlib.RawInflate(buffer).decompress();

  return decodeToUTF8(decompressData);
}
