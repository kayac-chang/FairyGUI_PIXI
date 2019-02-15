// @flow

import {pipe} from 'ramda';
import {Zlib} from 'zlibjs/bin/rawinflate.min';
import {decodeToUTF8} from './convert';

function decompressPackage(buf) {

  const data = new Zlib.RawInflate(buf).decompress();

  const source: string = decodeToUTF8(data);



  let curr: number = 0;

  let fn: string;
  let size: number;
  while (true) {
    let pos: number = source.indexOf("|", curr);
    if (pos == -1)
      break;
    fn = source.substring(curr, pos);
    curr = pos + 1;
    pos = source.indexOf("|", curr);
    size = parseInt(source.substring(curr, pos));
    curr = pos + 1;
    this.$resData[fn] = source.substr(curr, size);
    curr += size;
  }


}

