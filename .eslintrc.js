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
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
    "worker": true,
    "serviceworker": true,
    "es6": true
  },
  "extends": "airbnb",
  "parser": "babel-eslint",
  "globals": {
    "FontFaceObserver": true,
    "fontFaceSet": true,
  },
  "plugins": [
    "react",
    "jsx-a11y",
    "import",
    "jest"
  ],
  "rules": {
    "jsx-a11y/anchor-is-valid": [ "error", { "components": [ "Link" ], "specialLink": [ "to" ] } ],
    "no-underscore-dangle": ["error", { "allow": ["_id", "_insertCss", "_getCss","__REDUX_STATE__", "_meta"] }],
    "no-restricted-syntax": ["error", "WithStatement", "BinaryExpression[operator='in']"]
  },
  "settings": {
    "import/resolver": {
      "babel-module": {
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
      }
    }
  }
};
