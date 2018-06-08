const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const projectPath = path.resolve(__dirname, '../../');

const config = {
  mode: 'development',
  entry: {
    client: [
      '@babel/polyfill',
    ],
  },
  output: {
    libraryTarget: 'umd',
    path: path.resolve(projectPath, 'build'),
    publicPath: '/',
    chunkFilename: '[name].chunk.js',
    filename: '[name].bundle.js',
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      defaultSizes: 'gzip',
      openAnalyzer: false,
      generateStatsFile: false,
      statsFilename: 'anal.json',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('local'),
      'process.env.NODE_DEV_SERVER': process.env.NODE_DEV_SERVER,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(projectPath, 'src/shared/template/index.pug'),
      inject: 'body',
    }),
  ],
};

if (process.env.NODE_DEV_SERVER === 'true') {
  config.devServer = {
    hot: true,
    inline: true,
    compress: true,
    contentBase: ['/', path.join(projectPath, 'build'), path.join(projectPath, 'src/static')],
    port: 3030,
    host: '127.0.0.1',
    https: false,
    compress: false,
    historyApiFallback: true,
    disableHostCheck: true,
    open: true,
    openPage: '',
  };
  config.entry.client.push('react-hot-loader/patch');
  config.entry.client.push('webpack-dev-server/client?http://127.0.0.1:3030');
}

config.entry.client.push(path.join(projectPath, 'src/client/index.jsx'));

module.exports = config;
