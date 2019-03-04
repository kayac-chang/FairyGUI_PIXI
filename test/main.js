import {Application} from 'pixi.js';
import {addPackage} from '../src/resource';

const app = new Application();
app.loader
    .add('Package1@atlas0.jpg')
    .add('Package1', {xhrType: 'arraybuffer'})
    .load(onStart);

function onStart(loader) {
  function getResource(key) {
    return loader.resources[key];
  }

  addPackage(getResource, 'Package1')
      .then(create('Main'))
}

function create(resName) {


}

