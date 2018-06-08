const webpack = require('webpack');
const path = require('path');

const projectPath = path.resolve(__dirname, '../../');

const config = {
  mode: 'development',
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
    chunkFilename: '[name].chunk.js',
    filename: '[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('local'),
      'process.env.NODE_DEV_SERVER': process.env.NODE_DEV_SERVER,
    }),
  ],
};


module.exports = config;
