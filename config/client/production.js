const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const projectPath = path.resolve(__dirname, '../../');

module.exports = {
  mode: 'production',
  entry: {
    client: ['babel-polyfill', './src/client'],
  },
  output: {
    path: path.resolve(projectPath, 'build'),
    publicPath: '/',
    chunkFilename: '[name]-[hash].chunk.js',
    filename: '[name]-[hash].bundle.js',
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.pcss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[local]~~~~[hash:base64:24]',
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[local]~~~~[hash:base64:24]',
            },
          },
        ],
      },
    ],
  },
};
