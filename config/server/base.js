const NodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const fs = require('fs');
const webpack = require('webpack');
const path = require('path');

const projectPath = path.resolve(__dirname, '../../');
const pathToSrc = path.resolve(projectPath, 'src');
const stats = fs.statSync(pathToSrc);
const updateTime = new Date(stats.mtime);

module.exports = {
  target: 'node',
  externals: [NodeExternals()],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    symlinks: true,
    modules: [
      path.resolve(projectPath, 'node_modules'),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.IS_SERVER': false,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: 'file-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.pug$/,
        use: 'pug-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.pcss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
    ],
  },
};
