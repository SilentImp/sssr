const fs = require('fs');
const path = require('path');

const projectPath = path.resolve(__dirname, './');
const pathToSrc = path.resolve(projectPath, 'src');
const configPath = path.resolve(projectPath, 'config/app');
const stats = fs.statSync(pathToSrc);

const env = process.env.NODE_ENV || 'dev';
const envAppConfigURL = path.resolve(configPath, `${env}.js`);
const devAppConfigURL = path.resolve(configPath, 'dev.js');
const localAppConfigURL = path.resolve(configPath, 'local.js');
const sampleAppConfigURL = path.resolve(configPath, 'local.sample.js');

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
  "presets": [
    ["@babel/preset-env", {
        "targets": {
          "node": "current",
          "browsers": ["> 3%", "ie 11"]
        },
        "debug": false,
        "forceAllTransforms": true,
    }],
    "@babel/preset-react",
    ["@babel/preset-stage-0", {
      "decoratorsLegacy": true,
    }]
  ],
  "plugins": [
    ["module-resolver", {
      "root": ["/"],
      "alias": {
        Config$: ConfigURL,
        Utils: path.resolve(projectPath, 'src/shared/utils/'),
        Components: path.resolve(projectPath, 'src/shared/components/'),
        Reducers: path.resolve(projectPath, 'src/shared/reducers/'),
        Images: path.resolve(projectPath, 'src/shared/assets/images/'),
        Icons: path.resolve(projectPath, 'src/shared/assets/icons/'),
        Styles: path.resolve(projectPath, 'src/shared/assets/styles/'),
        Shared: path.resolve(projectPath, 'src/shared/'),
      }
    }],
    "react-css-modules",
    "@babel/plugin-proposal-export-default-from",
    ["@babel/plugin-proposal-decorators", {
      "legacy": true
    }],
    ["@babel/plugin-proposal-class-properties", {
      "loose" : true
    }]
  ],
};
