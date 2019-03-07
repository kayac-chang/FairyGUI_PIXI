import {Zlib} from 'zlibjs/bin/rawinflate.min';
import {decodeToUTF8} from '../index';

/**
 * DeCompress the ArrayBuffer To UTF-8 String
 *
 * @param {ArrayBuffer} buffer
 * @return {string} decompressed
 */
export function decompressToString(buffer: ArrayBuffer): string {
  const decompressData = new Zlib.RawInflate(buffer).decompress();

  return decodeToUTF8(decompressData);
}
