const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const fs = require('fs');
const webpack = require('webpack');
const path = require('path');

const projectPath = path.resolve(__dirname, '../../');
const pathToSrc = path.resolve(projectPath, 'src');
const stats = fs.statSync(pathToSrc);
const updateTime = new Date(stats.mtime);

const env = process.env.NODE_ENV || 'dev';
const envAppConfigURL = path.resolve(__dirname, `../app/${env}.js`);
const devAppConfigURL = path.resolve(__dirname, 'dev.js');
const localAppConfigURL = path.resolve(__dirname, 'local.js');
const sampleAppConfigURL = path.resolve(__dirname, 'local.sample.js');

const isEnvConfig = fs.existsSync(envAppConfigURL);
const isDevConfig = fs.existsSync(devAppConfigURL);
const isLocalConfig = fs.existsSync(localAppConfigURL);
const isSampleConfig = fs.existsSync(sampleAppConfigURL);

let ConfigURL;

if (isEnvConfig) {
  ConfigURL = envAppConfigURL;
} else if (isLocalConfig) {
  ConfigURL = localAppConfigURL;
} else if (isSampleConfig) {
  ConfigURL = sampleAppConfigURL;
} else {
  ConfigURL = devAppConfigURL;
}

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
    alias: {
      Config$: ConfigURL,
      Utils: path.resolve(projectPath, 'src/shared/utils/'),
      Components: path.resolve(projectPath, 'src/shared/components/'),
      Reducers: path.resolve(projectPath, 'src/shared/reducers/'),
      Images: path.resolve(projectPath, 'src/shared/assets/images/'),
      Icons: path.resolve(projectPath, 'src/shared/assets/icons/'),
      Styles: path.resolve(projectPath, 'src/shared/assets/styles/'),
      Shared: path.resolve(projectPath, 'src/shared/'),
    },
    modules: [
      path.resolve(projectPath, 'node_modules')
    ],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    child_process: 'empty',
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: "React",
      react: "React",
      "window.react": "React",
      "window.React": "React",
    }),
    new webpack.DefinePlugin({
      'process.env.IS_SERVER': false,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
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
              modules: true,
              importLoaders: 0,
              localIdentName: '[local]~~~~[hash:base64:24]',
            },
          },
        ]
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
        ]
      },
    ],
  },
};
