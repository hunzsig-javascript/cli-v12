const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const SimpleProgressPlugin = require('webpack-simple-progress-plugin');
const webpack = require('webpack');

const AppendStyleWebpackPlugin = require('../plugins/append-style-webpack-plugin');
const normalizeEntry = require('../utils/normalizeEntry');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (paths, options = {}, themeConfig = {}) {
  const defineVriables = {
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development'
    ),
  };

  // support theme type, eg. dark or light
  if (themeConfig && typeof themeConfig.theme === 'string') {
    defineVriables.THEME = JSON.stringify(themeConfig.theme);
  }

  const _version = (new Date()).getTime();
  const plugins = [
    new HtmlWebpackPlugin({
      inject: true,
      templateParameters: {
        process: process,
      },
      template: paths.appHtml,
      minify: false,
    }),
    new webpack.DefinePlugin(defineVriables),
    new MiniCssExtractPlugin({
      filename: process.env.BUILD_HASH
        ? 'css/[name].[hash:6].css?_v=' + _version
        : 'css/[name].css?_v=' + _version,
      chunkFilename: process.env.BUILD_HASH
        ? 'css/[id].[hash:6].css?_v=' + _version
        : 'css/[id].css?_v=' + _version,
      ignoreOrder: true,
    }),
    new SimpleProgressPlugin(),
    new CaseSensitivePathsPlugin(),
  ];

  const themePackage = options.theme || options.themePackage;
  let iconScssPath;
  let skinOverridePath;
  let variableFilePath;

  if (themePackage) {
    variableFilePath = path.resolve(
      paths.appNodeModules,
      `${themePackage}/variables.scss`
    );
    iconScssPath = path.resolve(
      paths.appNodeModules,
      `${themePackage}/icons.scss`
    );
    skinOverridePath = path.join(
      paths.appNodeModules,
      themePackage,
      'override.scss'
    );
  }

  if (iconScssPath && fs.existsSync(iconScssPath)) {
    const appendStylePluginOption = {
      type: 'sass',
      srcFile: iconScssPath,
      variableFile: variableFilePath,
      distMatch: (chunkName, compilerEntry, compilationPreparedChunks) => {
        const entriesAndPreparedChunkNames = normalizeEntry(
          compilerEntry,
          compilationPreparedChunks
        );
        // 仅对 css 的 chunk 做 处理
        if (entriesAndPreparedChunkNames.length && /\.css$/.test(chunkName)) {
          const assetsFromEntry = chunkName.replace(/\.\w+$/, '');
          if (entriesAndPreparedChunkNames.indexOf(assetsFromEntry) !== -1) {
            return true;
          }
        }
        return false;
      },
    };
    plugins.push(new AppendStyleWebpackPlugin(appendStylePluginOption));
  }

  if (skinOverridePath && fs.existsSync(skinOverridePath)) {
    // eslint-disable-next-line no-console
    console.log('皮肤 override 文件存在, 添加...');
    plugins.push(
      new AppendStyleWebpackPlugin({
        variableFile: variableFilePath,
        appendPosition: 'footer',
        type: 'sass',
        srcFile: skinOverridePath,
        distMatch: /\.css/,
      })
    );
  }
  return plugins;
};
