const fs = require('fs');
const merge = require('webpack-merge');
const baseConfig = require('./config/server/base.js');

const env = process.env.NODE_ENV || 'dev';
const envConfigURL = `./config/server/${env}.js`;

/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-dynamic-require */
const envConfig = fs.existsSync(envConfigURL)
  ? require(envConfigURL)
  : (process.env.NODE_ENV === 'local')
    ? require('./config/server/local.sample.js')
    : require('./config/server/dev.js');
/* eslint-enable no-nested-ternary */
/* eslint-enable import/no-dynamic-require */

module.exports = merge(baseConfig, envConfig);
