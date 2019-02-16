import {Loader} from 'pixi.js';
import {
  getFairyConfig, getAtlasConfig, getPackageConfig, decompress,
} from './resource';

new Loader().add('assets/Slot_062_TaiWangSiShen', {xhrType: 'arraybuffer'})
    .load(onStart);

function onStart(loader) {
  const buf = loader.resources['assets/Slot_062_TaiWangSiShen'].data;
  const data = decompress(buf);
  getFairyConfig(data)
      .then(function(config) {
        //  Atlas Configs
        getAtlasConfig(config['sprites.bytes']);

        //  id, name, items
        const result = getPackageConfig(config['package.xml']);

        console.log(result);
      });
}

function getBitmapFont() {
  
}
