import React from 'react';
import TMMemcached from 'Utils/TMMemcached';
import { AppContainer } from 'react-hot-loader';
import { createMemoryHistory as createHistory } from 'history';
import { renderToString } from 'react-dom/server';
import fs from 'fs';

import template from 'Shared/template/index.pug';

import configureStore from 'Shared/store';
import i18n from 'Shared/i18n';
import Root from 'Shared/Root';
import stats from '../../../stats.json';

const penthouse = require('penthouse');
const path = require('path');

const name = `./build/store/${Math.floor(Date.now() / 3000000)}.json`;

const ROUTE_NAME = 'license';

const {
  assetsByChunkName: {
    client: assets,
  },
} = stats;

const url = require('url');

const getData = async ({
  store,
  memcached,
  TM_CACHE_CONFIG,
  timings,
  isChrome,
  isCanary,
}) => {
  const requests = [];
  const startGettingData = process.hrtime();

  requests.push(store.dispatch({
    type: 'TEST',
  }));

  return Promise.all(requests).then(async () => {
    const endGettingData = process.hrtime();
    const gettingDataStart =
      parseInt(((startGettingData[0] * 1e3) + ((startGettingData[1]) * 1e-6)), 10);
    const gettingDataEnd =
      parseInt(((endGettingData[0] * 1e3) + ((endGettingData[1]) * 1e-6)), 10);
    if (isChrome && !isCanary) {
      timings.push(`DataLoad=${gettingDataEnd - gettingDataStart}; "Loading data"`);
    }
    if (isCanary || !isChrome) {
      timings.push(`dataload;desc="Reading cache";dur=${gettingDataEnd - gettingDataStart}`);
    }
    await memcached.set(ROUTE_NAME, store.getState(), TM_CACHE_CONFIG.ttl);
    await memcached.set(`${ROUTE_NAME}-backup`, store.getState(), parseInt(TM_CACHE_CONFIG.ttl, 10) + 30000);
  });
};

const generateCriticalCSS = async ({
  uri,
  memcached,
  TM_CACHE_CONFIG,
}) => new Promise(async (resolve, reject) => {
  try {
    fs.readFile('./build/server.css', 'utf8', async (err, cssString) => {
      console.log('getting critical');

      const css = await penthouse({
        url: `${uri}?criticalCSS=true`,
        cssString,
        height: 500,
        propertiesToRemove: ['(.*)transition(.*)', 'cursor', 'pointer-events', '(-webkit-)?tap-highlight-color', '(.*)user-select'],
      });

      console.warn('adding to cache: ', `critical-${ROUTE_NAME}`);

      await memcached.set(`critical-${ROUTE_NAME}`, css, TM_CACHE_CONFIG.ttl * 100);
      await memcached.set(`critical-${ROUTE_NAME}-backup`, css, parseInt(TM_CACHE_CONFIG.ttl, 10) + 30000);

      resolve(css);
    });
  } catch (error) {
    console.warn('generation error: ', error);
    reject(error.message);
  }
});

export const LicenseRoute = async (
  cdnUrl,
  req,
  res,
) => { // eslint-disable-line consistent-return
  const TM_CACHE_CONFIG = (process.env.TM_CACHE_CONFIG !== undefined) ?
    JSON.parse(process.env.TM_CACHE_CONFIG) : null;
  const TM_CACHE_MEMCACHE = TM_CACHE_CONFIG && Object.keys(TM_CACHE_CONFIG).length > 0;
  let memcached = null;

  if (TM_CACHE_MEMCACHE) {
    await (async () => {
      memcached = new TMMemcached();
      try {
        await memcached.init();
        } catch (error) {} // eslint-disable-line
    })();
  }

  const userAgent = req.header('User-Agent');
  const isChrome = (userAgent.indexOf(' Chrome/') > -1);
  const chromeData = / Chrome\/([\d]+)./ig.exec(userAgent);
  const chromeVersion = (chromeData === null) ? null : parseInt(chromeData[1], 10);
  const isCanary = isChrome && (chromeVersion > 64);

  const languagePrimary = req.params.language;
  const languageSecondary = req.query.lang;
  if (languagePrimary !== undefined) {
    i18n.changeLanguage(languagePrimary);
  } else if (languageSecondary !== undefined) {
    i18n.changeLanguage(languageSecondary);
  } else {
    i18n.changeLanguage('en');
  }

  const timings = [];
  let processStart = process.hrtime();
  const history = createHistory();
  const currentURL = url.parse(req.url, true);
  history.location = {
    pathname: currentURL.pathname,
    search: currentURL.search === null ? '' : currentURL.search,
    hash: currentURL.hash === null ? '' : currentURL.hash,
  };

  let criticalCSS = '';

  if (!req.query.criticalCSS) {
    let criticalCSSStart = process.hrtime();
    try {
      console.warn('critical css loaded from main cache: ', `critical-${ROUTE_NAME}`);
      criticalCSS = await memcached.get(`critical-${ROUTE_NAME}`);
      console.warn('critical css loaded from main cache success');
    } catch (error) {
      try {
        console.warn('critical css loaded from backup cache: ', `critical-${ROUTE_NAME}-backup`);
        criticalCSS = await memcached.get(`critical-${ROUTE_NAME}-backup`);
        generateCriticalCSS({
          uri: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
          memcached,
          TM_CACHE_CONFIG,
        });
        console.warn('critical css loaded from backup success');
      } catch (err) {
        try {
          console.warn('critical css generated');
          criticalCSS = await generateCriticalCSS({
            uri: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
            memcached,
            TM_CACHE_CONFIG,
          });
          console.warn('critical css generated success');
        } catch (e) {} // eslint-disable-line
      }
    }
    let criticalCSSEnd = process.hrtime();
    criticalCSSStart =
      parseInt(((criticalCSSStart[0] * 1e3) + ((criticalCSSStart[1]) * 1e-6)), 10);
    criticalCSSEnd =
      parseInt(((criticalCSSEnd[0] * 1e3) + ((criticalCSSEnd[1]) * 1e-6)), 10);
    if (isChrome && !isCanary) timings.push(`CriticalCSS=${criticalCSSEnd - criticalCSSStart}; "Critical CSS"`);
    if (isCanary || !isChrome) timings.push(`criticalcss;desc="Critical CSS";dur=${criticalCSSEnd - criticalCSSStart}`);
  }

  let store = null;
  try {
    let readFromCacheStart = process.hrtime();
    console.log(`getting ${ROUTE_NAME} from cache`);
    store = await memcached.get(ROUTE_NAME);
    console.log(`getting ${ROUTE_NAME} from cache success`);
    store = configureStore({
      ...store,
      router: history,
    }, history);
    let readFromCacheEnd = process.hrtime();

    readFromCacheStart =
      parseInt(((readFromCacheStart[0] * 1e3) + ((readFromCacheStart[1]) * 1e-6)), 10);
    readFromCacheEnd =
      parseInt(((readFromCacheEnd[0] * 1e3) + ((readFromCacheEnd[1]) * 1e-6)), 10);
    if (isChrome && !isCanary) timings.push(`CacheRead=${readFromCacheEnd - readFromCacheStart}; "Reading cache"`);
    if (isCanary || !isChrome) timings.push(`cacheread;desc="Reading cache";dur=${readFromCacheEnd - readFromCacheStart}`);
  } catch (error) {
    try {
      let readFromCacheBackupStart = process.hrtime();
      console.log(`getting ${ROUTE_NAME}-backup from cache`);
      store = await memcached.get(`${ROUTE_NAME}-backup`);
      console.log(`getting ${ROUTE_NAME}-backup from cache success`);
      store = configureStore({
        ...store,
        router: history,
      }, history);
      setTimeout(async () => {
        await getData({
          store,
          memcached,
          TM_CACHE_CONFIG,
          timings,
          isChrome,
          isCanary,
        });
        fs.writeFile(
          path.resolve(name),
          JSON.stringify(store.getState()).replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029'),
          () => {},
        );
      }, 0);
      let readFromCacheBackupEnd = process.hrtime();

      readFromCacheBackupStart =
        parseInt(((readFromCacheBackupStart[0] * 1e3)
        + ((readFromCacheBackupStart[1]) * 1e-6)), 10);
      readFromCacheBackupEnd =
        parseInt(((readFromCacheBackupEnd[0] * 1e3)
        + ((readFromCacheBackupEnd[1]) * 1e-6)), 10);
      if (isChrome && !isCanary) timings.push(`CacheRead=${readFromCacheBackupEnd - readFromCacheBackupStart}; "Reading cache"`);
      if (isCanary || !isChrome) timings.push(`cacheread;desc="Reading cache";dur=${readFromCacheBackupEnd - readFromCacheBackupStart}`);
    } catch (err) {
      console.log('no cache: ', err);
      store = configureStore({ router: history }, history);
      await getData({
        store,
        memcached,
        TM_CACHE_CONFIG,
        timings,
        isChrome,
        isCanary,
      });

      fs.writeFile(
        path.resolve(name),
        JSON.stringify(store.getState()).replace(/\u2028/g, '\\u2028')
          .replace(/\u2029/g, '\\u2029'),
        () => {},
      );
    }
  }

  let renderStart = process.hrtime();
  const application = renderToString((
    <AppContainer>
      <Root
        store={store}
        history={history}
        location={req.url}
      />
    </AppContainer>
  ));

  let renderEnd = process.hrtime();

  const scripts = assets.filter((uri) => {
    const extension = uri.split('.').slice(-1)[0];
    return (extension === 'js');
  }).map(uri => `<script async src="${cdnUrl}${uri}"></script>`.replace(/(.+)\/\//ig, '$1/')).join('');

  const styles = assets.filter((uri) => {
    const extension = uri.split('.').slice(-1)[0];
    return (extension === 'css');
  }).map(uri => `<link rel="preload" href="${cdnUrl}${uri}" as="style" onload="this.rel = 'stylesheet'" /><noscript><link rel="stylesheet" href="${cdnUrl}${uri}" /></noscript>`.replace(/(.+)\/\//ig, '$1/')).join(''); // eslint-disable-line


  renderEnd = parseInt(((renderEnd[0] * 1e3) + ((renderEnd[1]) * 1e-6)), 10);
  renderStart = parseInt(((renderStart[0] * 1e3) + ((renderStart[1]) * 1e-6)), 10);
  if (isChrome && !isCanary) timings.push(`SSR=${renderEnd - renderStart}; SSR`);
  if (isCanary || !isChrome) timings.push(`ssr;desc="SSR";dur=${renderEnd - renderStart}`);

  let processEnd = process.hrtime();
  processStart = parseInt(((processStart[0] * 1e3) + ((processStart[1]) * 1e-6)), 10);
  processEnd = parseInt(((processEnd[0] * 1e3) + ((processEnd[1]) * 1e-6)), 10);
  if (isChrome && !isCanary) timings.push(`FullTime=${processEnd - processStart}; "Full time"`);
  if (isCanary || !isChrome) timings.push(`fulltime;desc="Full time";dur=${processEnd - processStart}`);

  console.log('Server-Timing', timings); // eslint-disable-line

  res.set('Server-Timing', timings);
  res.end(template({
    font: (req.cookies.font !== undefined),
    title: 'Template Monster',
    cdnUrl,
    application,
    scripts,
    styles,
    criticalCSS,
  }));
};

export default LicenseRoute;
