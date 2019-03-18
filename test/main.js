import {Application} from 'pixi.js';
import {addPackage} from '../src';

global.log = console.log;

function main(...args) {
  const app = new Application();
  document.body.appendChild(app.view);

  load(app).then(start);
}

function load(app) {
  app.loader.baseUrl = 'assets';
  app.loader
      .add('Package1@atlas0.jpg')
      .add('Package1@atlas1.png')
      .add('Package1.fui', {xhrType: 'arraybuffer'});

  return new Promise(onLoaded);

  function onLoaded(resolve) {
    app.loader.load(() => resolve(app));
  }
}

function start(app) {
  const create = addPackage(app, 'Package1');
  const ins = create('Main');

  app.stage.addChild(ins);
}

//  Execute
main();


