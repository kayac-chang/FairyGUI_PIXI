//  Imports
const {resolve} = require('path');
const {ProgressPlugin, optimize} = require('webpack');
const {ModuleConcatenationPlugin} = optimize;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

//  Path
const {mapObjIndexed, call} = require('ramda');
const {
  getSourceDir: sourceDir,
  getTestDir: testDir,
  getProductDir: productDir,
  getPublicPath: publicPath,
  getAssetsDir: assetsDir,
  getBaseDir: baseDir,
  getToolDir: toolDir,
} = mapObjIndexed(call)(require('../constant'));

//  Exports
module.exports = function(...args) {
  return {
    //  Entry   ===========================================
    entry: resolve(testDir, 'main.js'),

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
          include: [
            sourceDir,
            testDir,
          ],
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

      new CopyWebpackPlugin([
        {from: assetsDir, to: resolve(productDir, 'assets')},
      ]),
    ],
    //  END ============================================
  };
};
