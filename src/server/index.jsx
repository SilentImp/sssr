import Config from 'Config';
import cookieParser from 'cookie-parser';
import queryParser from 'query-parser-express';
import earlyHints from 'early-hints';
import { resolve } from 'path';
import { TestRoute, LicenseRoute } from './routes';
import stats from '../../stats.json';

const {
  assetsByChunkName: assets,
} = stats;

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

const earlyHintResources = [
  { path: `/store/${Math.floor(Date.now() / 3000000)}.json`, rel: 'preload', as: 'script' },
  { path: 'https://unpkg.com/react@16/umd/react.development.js', rel: 'preload', as: 'script' },
  { path: 'https://unpkg.com/react-dom@16/umd/react-dom.development.js', rel: 'preload', as: 'script' },
  { path: '/worker.js', rel: 'preload', as: 'worker' },
  { path: '/javascript/fontfaceobserver.standalone.js', rel: 'preload', as: 'script' },
  { path: '/javascript/fontloader.min.js', rel: 'preload', as: 'script' },
  { path: '/favicon-16x16.png', rel: 'preload', as: 'image' },
  { path: '/favicon-32x32.png', rel: 'preload', as: 'image' },
];

Object.values(assets).forEach((bundle) => {
  bundle.forEach((uri) => {
    const extension = uri.split('.').slice(-1)[0];
    earlyHintResources.push({ path: `/${uri}`, rel: 'preload', as: translate[extension] });
  });
});

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection: ', error.message);
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
app.use(queryParser());
app.use(compression());
if (TM_CACHE_MEMCACHE) app.use(cache(TM_CACHE_CONFIG.ttl));

const envHeaders = {};
Object.keys(process.env).forEach((key) => {
  if (key.indexOf('X_BACKEND') === 0) {
    envHeaders[key.replace(/_/ig, '-').replace(/([A-Z])([a-z]+)/ig, (match, p1, p2) => `${p1}${p2.toLowerCase()}`)] = process.env[key];
  }
});

const rootPath = [
  '^/:language([a-z]{1,2})/license/',
  '^/license/',
  '^/:language([a-z]{1,2})/',
  '^/',
];

app.use(rootPath, earlyHints(earlyHintResources));

app.use(rootPath, (req, res, next) => {
  Object.values(assets).forEach((bundle) => {
    bundle.forEach((uri) => {
      const extension = uri.split('.').slice(-1)[0];
      res.append('Link', `</${uri}>; as="${translate[extension]}"; rel="preload"`);
    });
  });
  res.append('Link', `</store/${Math.floor(Date.now() / 3000000)}.json>; rel="preload"; as="script"`);
  res.append('Link', '<https://unpkg.com/react@16/umd/react.development.js>; rel="preload"; as="script"');
  res.append('Link', '<https://unpkg.com/react-dom@16/umd/react-dom.development.js>; rel="preload"; as="script"');
  res.append('Link', '</worker.js>; rel="preload"; as="script"');
  res.append('Link', '</javascript/fontfaceobserver.standalone.js>; as="script"; rel="preload"');
  res.append('Link', '</javascript/fontloader.min.js>; as="script"; rel="preload"');
  res.append('Link', '</favicon-16x16.png>; as="image"; rel="preload"');
  res.append('Link', '</favicon-32x32.png>; as="image"; rel="preload"');
  next();
});

app.use((req, res, next) => {
  res.append('Content-Type', 'text/html; charset=utf-8');
  res.append('Transfer-Encoding', 'chunked');
  res.append('Access-Control-Allow-Origin', ['*']);
  Object.keys(envHeaders).forEach((key) => {
    res.set(key, envHeaders[key]);
  });
  res.charset = 'utf-8';
  next();
});

app.get('^/:language([a-z]{1,2})/license/', LicenseRoute.bind(this, cdnUrl));
app.get('^/license/', LicenseRoute.bind(this, cdnUrl));
app.get('^/:language([a-z]{1,2})/', TestRoute.bind(this, cdnUrl));
app.get('^/', TestRoute.bind(this, cdnUrl));

const port = process.env.TM_SERVER_PORT || Config.serverPort || 3006;
app.listen(port, () => console.log('StoreFront server listening on port ' + port)); // eslint-disable-line
