import React from 'react';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import 'react-router';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import stylesReset from 'reset.css';
import configureStore from 'Shared/store';
import i18n from 'Shared/i18n';
import Root from 'Shared/Root';
import ContextProvider from 'Components/ContextProvider/index';

import stylesMain from 'Styles/main.pcss';

(async () => {
  const method = process.env.NODE_ENV === 'local' ? 'render' : 'hydrate';

  let data = {};

  try {
    const response = await fetch(`/store/${Math.floor(Date.now() / 3000000)}.json`);
    data = await response.json();
  } catch (error) {} // eslint-disable-line

  const history = createHistory();
  const store = configureStore( data, history );

  ReactDOM[method](
    <AppContainer>
      <ContextProvider>
        <Root
          store={store}
          history={history}
          i18n={i18n}
        />
      </ContextProvider>
    </AppContainer>,
    document.getElementById('root'),
  );

  // Hot Module Replacement API
  if (module.hot) {
    module.hot.accept('../shared/Root', () => {
      ReactDOM.render(
        <AppContainer>
          <ContextProvider>
            <Root
              store={store}
              history={history}
              i18n={i18n}
            />
          </ContextProvider>
        </AppContainer>,
        document.getElementById('root'),
      );
    });
  }

})();
