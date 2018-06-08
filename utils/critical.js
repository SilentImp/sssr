const penthouse = require('penthouse');
const path = require('path');
const md5 = require('md5');
const fs = require('fs');

const urls = [
  'http://sssr/',
];

const penthouseOptions = {
  css: path.resolve('./build/server.css'),
  height: 500,
  width: 1300,
  strict: false,
  timeout: 30000,
};

function startNewJob() {
  const url = urls.pop();
  if (!url) {
    return Promise.resolve();
  }

  return penthouse({
    url,
    ...penthouseOptions,
  })
    .then((criticalCss) => {
      fs.writeFileSync(`./build/critical-${md5(url.replace(/^http(s)?:/ig, ''))}.css`, criticalCss);
      return startNewJob();
    });
}

Promise.all([
  startNewJob(),
  startNewJob(),
  startNewJob(),
  startNewJob(),
  startNewJob(),
])
.then(() => {}); // eslint-disable-line
