import {Loader} from 'pixi.js';
import {addPackage} from './resource';

new Loader().add('assets/Slot_062_TaiWangSiShen', {xhrType: 'arraybuffer'})
    .load(onStart);

function onStart(loader) {
  addPackage(loader, 'assets/Slot_062_TaiWangSiShen')
      .then((res) => console.log(res));
}

