const webpack = require('webpack');
const path = require('path');

const projectPath = path.resolve(__dirname, '../../');

module.exports = {
  mode: 'development',
  entry: {
    server: ['babel-polyfill', './src/server'],
  },
  output: {
    libraryTarget: 'umd',
    path: path.resolve(projectPath, 'build'),
    publicPath: '/',
    chunkFilename: '[name]-[hash].chunk.js',
    filename: '[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('local'),
    }),
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        use: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
