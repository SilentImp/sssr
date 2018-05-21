const webpack = require('webpack');
const path = require('path');

const projectPath = path.resolve(__dirname, '../../');

module.exports = {
  mode: 'development',
  entry: {
    server: [
      'babel-polyfill',
      path.join(projectPath, 'src/server/index.jsx'),
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('dev'),
    }),
  ],
  module: {
    // rules: [
    //   {
    //     enforce: 'pre',
    //     test: /\.jsx?$/,
    //     use: 'eslint-loader',
    //     exclude: /node_modules/,
    //   },
    // ],
  },
};
