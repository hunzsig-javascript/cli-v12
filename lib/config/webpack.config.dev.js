const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const getWebpackConfigBasic = require('./webpack.config.basic');

const env = process.env;

module.exports = function getWebpackConfigDev(entry, paths, options = {}) {
  const baseConfig = getWebpackConfigBasic(entry, paths, options);

  const plugins = [new webpack.HotModuleReplacementPlugin()];

  return webpackMerge(baseConfig, {
    devtool: 'cheap-module-source-map',
    output: {
      publicPath: '/dist/',
    },
    plugins,
  });
};
