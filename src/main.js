import {Zlib} from 'zlibjs/bin/rawinflate.min';
import {decodeToUTF8} from './convert';
import {Loader} from 'pixi.js';

new Loader().add('assets/Slot_062_TaiWangSiShen', {xhrType: 'arraybuffer'}
)
    .load(function(loader) {
      console.log(loader.resources);
      window.buf = loader.resources['assets/Slot_062_TaiWangSiShen'].data;
    });

/**
 * DeCompress the ArrayBuffer To UTF-8 String
 *
 * @param {ArrayBuffer} buffer
 * @return {string} decompressed
 */
function decompress(buffer: ArrayBuffer) : string {
  const decompressData = new Zlib.RawInflate(buffer).decompress();

  return decodeToUTF8(decompressData);
}

/**
 *
 * @param {string} origin
 */
function tokenize(origin: string) {
  debugger;

  function getKey(source: string) {
    return RegExp(/(.)+.xml|/g).exec(source)[0];
  }
}

window.decompress = decompress;
window.tokenize = tokenize;
