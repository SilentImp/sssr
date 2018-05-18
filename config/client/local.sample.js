const webpack = require('webpack');
const path = require('path');

const projectPath = path.resolve(__dirname, '../../');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');


module.exports = {
  mode: 'development',
  entry: {
    client: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?https://0.0.0.0:3030',
      path.join(projectPath, 'src/client'),
    ],
  },
  devServer: {
    hot: true,
    inline: true,
    contentBase: ['/', path.join(projectPath, 'build'), path.join(projectPath, 'src/static')],
    port: 3030,
    host: '127.0.0.1',
    compress: false,
    historyApiFallback: true,
    disableHostCheck: true,
    open: true,
    openPage: '',
  },
  output: {
    path: path.resolve(projectPath, 'build'),
    publicPath: '/',
    chunkFilename: '[name].chunk.js',
    filename: '[name].bundle.js',
  },
  plugins: [
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'disabled',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(projectPath, 'src/shared/template/index.pug'),
      inject: 'body',
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
    new webpack.HotModuleReplacementPlugin(),
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
      {
        test: /\.pcss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[local]',
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
              localIdentName: '[local]',
            },
          },
        ],
      },
    ],
  },
};
