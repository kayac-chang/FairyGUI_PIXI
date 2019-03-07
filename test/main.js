import {Application} from 'pixi.js';
import {addPackage} from '../src/resource';
// import {curry, find, propEq, toPairs} from 'ramda';
// import {toNumberPair} from '../src/util';

// const {log} = console;

const app = new Application();
document.body.appendChild(app.view);

app.loader.baseUrl = 'assets';
app.loader
    .add('Package1@atlas0.jpg')
    .add('Package1@atlas2.png')
    .add('Package1.fui', {xhrType: 'arraybuffer'})
    .load(onStart);

function onStart(loader, resources) {
  function getResource(key) {
    return resources[key];
  }

  const create = addPackage(getResource, 'Package1');

  create('Main');
}
