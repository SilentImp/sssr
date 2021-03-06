const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const projectPath = path.resolve(__dirname, '../../');

module.exports = {
  mode: 'development',
  entry: {
    client: [
      '@babel/polyfill',
      path.join(projectPath, 'src/client/index.jsx'),
    ],
  },
  output: {
    libraryTarget: 'umd',
    path: path.resolve(projectPath, 'build/'),
    publicPath: '/',
    chunkFilename: '[name]-[hash].chunk.js',
    filename: '[name]-[hash].bundle.js',
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('dev'),
    }),
  ],
  module: {
    rules: [],
  },
};
