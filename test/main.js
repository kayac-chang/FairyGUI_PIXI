import {Application} from 'pixi.js';
import {addPackage} from '../src';

global.log = console.log;

function main(...args) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const app = new Application({width, height});
  document.body.appendChild(app.view);

  load(app).then(start);
}

function load(app) {
  app.loader.baseUrl = 'assets';
  app.loader
    .add('main@atlas0.png')
    .add('main@atlas0_1.png')
    .add('main@atlas0_2.png')
    .add('main@atlas0_3.png')
    .add('main.fui', {xhrType: 'arraybuffer'});

  return new Promise(onLoaded);

  function onLoaded(resolve) {
    app.loader.load(() => resolve(app));
  }
}

function start(app) {
  const create = addPackage(app, 'main');
  const comp = create('Loading');

  app.stage.addChild(comp);
}

//  Execute
main();
