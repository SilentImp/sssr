const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const projectPath = path.resolve(__dirname, '../../');

module.exports = {
  mode: 'production',
  entry: {
    server: [
      '@babel/polyfill',
      path.resolve(projectPath, 'src/server'),
    ],
  },
  output: {
    libraryTarget: 'umd',
    path: path.resolve(projectPath, 'build'),
    publicPath: '/',
    chunkFilename: '[name]-[hash].chunk.js',
    filename: '[name].js',
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.NODE_DEV_SERVER': process.env.NODE_DEV_SERVER,
    }),
  ],
};
