const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const fs = require('fs');
const webpack = require('webpack');
const path = require('path');

const projectPath = path.resolve(__dirname, '../../');
const pathToSrc = path.resolve(projectPath, 'src');

module.exports = {
  target: 'web',
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    symlinks: true,
    modules: [
      path.resolve(projectPath, 'node_modules'),
    ],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    child_process: 'empty',
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'React',
      react: 'React',
      'window.react': 'React',
      'window.React': 'React',
    }),
    new webpack.DefinePlugin({
      'process.env.IS_SERVER': false,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[name]-[id].[hash].css',
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(projectPath, 'src/static'),
      to: '',
    }]),
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
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
      {
        test: /\.pcss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: true,
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
