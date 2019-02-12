//  Imports
const {resolve} = require('path');
const {ProgressPlugin, optimize} = require('webpack');
const {ModuleConcatenationPlugin} = optimize;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CSPHtmlWebpackPlugin = require('csp-html-webpack-plugin');

//  Path
const {mapObjIndexed, call} = require('ramda');
const {
  getSourceDir: sourceDir,
  getProductDir: productDir,
  getPublicPath: publicPath,
  getBaseDir: baseDir,
  getToolDir: toolDir,
} = mapObjIndexed(call)(require('../constant'));

//  Exports
module.exports = function(...args) {
  return {
    //  Entry   ===========================================
    entry: resolve(sourceDir, 'main.js'),

    //  Output  ===========================================
    output: {
      path: productDir,
      filename: 'bundle.js',
      publicPath: publicPath,
    },

    //  Optimization    ====================================
    optimization: {
      usedExports: true,
      concatenateModules: true,

      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        minChunks: 1,
      },
    },

    //  Module =============================================
    module: {
      rules: [
        {
          test: /\.js$/,
          include: sourceDir,
          sideEffects: false,
          use: [
            {
              loader: 'babel-loader',
              options: {configFile: resolve(toolDir, 'babel.config.js')},
            },
            {loader: 'eslint-loader'},
          ],
        },
        {
          test: /\.(ico)$/,
          use: [
            {loader: 'url-loader', options: {limit: 8192}},
          ],
        },
      ],
    },

    //  Plugins ==========================================
    plugins: [
      new ProgressPlugin(),

      new ModuleConcatenationPlugin(),

      new HtmlWebpackPlugin({
        filename: 'index.html',
        favicon: resolve(baseDir, 'favicon.ico'),
        template: resolve(baseDir, 'index.html'),
        hash: true,
      }),

      new CSPHtmlWebpackPlugin(),

    ],
    //  END ============================================
  };
};
