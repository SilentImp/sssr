import Config from 'Config';
import { resolve } from 'path';
import cookieParser from 'cookie-parser';
import { TestRoute } from './routes';
import stats from '../../stats.json';

const {
  assetsByChunkName: assets,
} = stats;

console.log('assets: ', assets);

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error.message);
  console.log(error);
});

const express = require('express');
const compression = require('compression');
const cache = require('express-cache-headers');

const TM_CACHE_CONFIG = (process.env.TM_CACHE_CONFIG !== undefined) ?
  JSON.parse(process.env.TM_CACHE_CONFIG) : null;
const TM_CACHE_MEMCACHE = TM_CACHE_CONFIG && Object.keys(TM_CACHE_CONFIG).length > 0;

let cdnUrl;
if (process !== undefined
  && process.env !== undefined
  && process.env.TM_CDN_URL !== undefined
  && process.env.TM_CDN_URL.length > 0) {
  cdnUrl = process.env.TM_CDN_URL;
} else if (Config.cdnUrl !== undefined && Config.cdnUrl.length > 0) {
  cdnUrl = Config.cdnUrl; // eslint-disable-line
} else {
  cdnUrl = '/';
}

const app = express();
app.use(express.static(resolve(process.cwd(), 'build')));


app.use(cookieParser());
app.use(compression());
if (TM_CACHE_MEMCACHE) app.use(cache(TM_CACHE_CONFIG.ttl));

const envHeaders = {};
Object.keys(process.env).forEach((key) => {
  if (key.indexOf('X_BACKEND') === 0) {
    envHeaders[key.replace(/_/ig, '-').replace(/([A-Z])([a-z]+)/ig, (match, p1, p2) => `${p1}${p2.toLowerCase()}`)] = process.env[key];
  }
});

app.use((req, res, next) => {
  res.append('Content-Type', 'text/html; charset=utf-8');
  res.append('Transfer-Encoding', 'chunked');
  // res.append('Trailer', 'Server-Timing');
  res.append('Access-Control-Allow-Origin', ['*']);
  Object.keys(envHeaders).forEach((key) => {
    res.set(key, envHeaders[key]);
  });
  res.charset = 'utf-8';
  next();
});

app.use((req, res, next) => {
  const translate = {
    js: 'script',
    css: 'style',
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    svg: 'image',
    gif: 'image',
    woff: 'font',
    woff2: 'font',
    eot: 'font',
    ttf: 'font',
  };
  Object.values(assets).forEach((bundle) => {
    bundle.forEach((uri) => {
      const extension = uri.split('.').slice(-1)[0];
      res.append('Link', `<${uri}>; as="${translate[extension]}"; rel="preload"`);
    });
  });
  res.append('Link', '<https://unpkg.com/react@16/umd/react.development.js>; rel="preload"; as="script"')
  res.append('Link', '</worker.js>; as="worker"; rel="preload"');
  res.append('Link', '</javascript/fontfaceobserver.standalone.js>; as="script"; rel="preload"');
  res.append('Link', '</javascript/fontloader.min.js>; as=script; rel=preload');
  next();
});

app.get('/', TestRoute.bind(this, cdnUrl));

const port = process.env.TM_SERVER_PORT || Config.serverPort || 3006;
app.listen(port, () => console.log('StoreFront server listening on port ' + port)); // eslint-disable-line
