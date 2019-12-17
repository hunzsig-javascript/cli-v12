/**
 * 构建项目生成 dist ，根据传入的路径地址，按照 page 的格则搜寻代码，并启动编译服务
 * @param {String} cwd 项目目录
 * @param {Object} options 命令行参数
 */

process.env.H_BUILD_TYPE = 'app';
process.env.NODE_ENV = 'production';

const rimraf = require('rimraf');
const webpack = require('webpack');

const getPaths = require('./config/paths');
const getEntries = require('./config/getEntry');
const getWebpackConfigProd = require('./config/webpack.config.prod');
const hCopy = require('./config/hCopy');

module.exports = function () {
  const cwd = process.cwd();
  const paths = getPaths(cwd);
  const entries = getEntries(cwd);
  // 指定构建的 entry
  // eslint-disable-next-line
  const packageData = require(paths.appPackageJson);
  const webpackConfig = getWebpackConfigProd(
    entries,
    paths,
    packageData.buildConfig
  );

  rimraf(webpackConfig.output.path, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('publicPath:', webpackConfig.output.publicPath);
      webpack(webpackConfig, (error, stats) => {
        console.log(
          stats.toString({
            colors: true,
            chunks: false,
            children: false,
            modules: false,
            chunkModules: false,
          })
        );
        if (stats.hasErrors()) {
          throw new Error('webpack compiled failed.');
        }
        hCopy.run(packageData.copyConfig);
        console.log('BUILD APP FINISHED');
      });
    }
  });

};
