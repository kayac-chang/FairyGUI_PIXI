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
      filename: 'fairyGUI_PIXI.js',
      publicPath: publicPath,
      library: 'fairyGUI_PIXI',
    },

    //  Optimization    ====================================
    optimization: {
      usedExports: true,
      sideEffects: false,
      concatenateModules: true,

      splitChunks: {
        chunks: 'all',
        minSize: 0,
        maxInitialRequests: Infinity,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName =
                module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                )[1];

              return `${packageName.replace('@', '')}`;
            },
          },
        },
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
