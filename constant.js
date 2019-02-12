/*
 *   **Important**
 *      This file made for path Redirecting.
 */

//  Imports
const {resolve} = require('path');
const {always, mapObjIndexed} = require('ramda');

//  Root Path
const rootPath = __dirname;

//  Project Element Path
const sourceDir = resolve(rootPath, 'src');
const baseDir = resolve(rootPath, 'base');
const toolDir = resolve(rootPath, 'tools');
const productDir = resolve(rootPath, 'dist');

//  Public Path
const publicPath = '/';

//  Encapsulate
const readOnly = mapObjIndexed(always);

module.exports = readOnly({
  getRootPath: rootPath,
  getPublicPath: publicPath,
  getSourceDir: sourceDir,
  getBaseDir: baseDir,
  getToolDir: toolDir,
  getProductDir: productDir,
});
