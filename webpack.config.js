const fs = require('fs');
const merge = require('webpack-merge');
const baseConfig = require('./config/client/base.js');

const env = process.env.NODE_ENV || 'dev';
const envConfigURL = `./config/client/${env}.js`;

/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-dynamic-require */
const envConfig = fs.existsSync(envConfigURL)
  ? require(envConfigURL)
  : (process.env.NODE_ENV === 'local')
    ? require('./config/client/local.sample.js')
    : require('./config/client/dev.js');
/* eslint-enable no-nested-ternary */
/* eslint-enable import/no-dynamic-require */

module.exports = merge(baseConfig, envConfig);
