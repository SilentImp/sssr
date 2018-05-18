if (typeof localStorage === 'undefined' || localStorage === null) {
  const { LocalStorage } = require('node-localstorage'); // eslint-disable-line
  localStorage = new LocalStorage('./localstorage'); // eslint-disable-line
}

require('browser-env')();

// Add environment variables from multiple config files
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cachePath = process.env.TM_CACHE_CONFIG || path.resolve(__dirname, '../', 'cache.json');
const cacheConfig = fs.existsSync(cachePath) // eslint-disable-next-line import/no-dynamic-require
  ? require(cachePath)
  : {}; // eslint-disable-line global-require import/no-dynamic-require
process.env.TM_CACHE_CONFIG = JSON.stringify(cacheConfig);

require('./server.js'); // eslint-disable-line
