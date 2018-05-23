// production config
const merge = require('webpack-merge');
const { resolve } = require('path');

const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: './index.js',
  // devtool: 'source-map',
  output: {
    filename: 'js/bundle.min.js',
    path: resolve(__dirname, '../../build'),
    publicPath: '/',
  },
  plugins: [],
});
