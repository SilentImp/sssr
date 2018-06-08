import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import 'react-router';
import createHistory from 'history/createBrowserHistory';

import configureStore from 'Shared/store';
import Root from 'Shared/Root';

(async () => {
  const method = (
    (process.env.NODE_ENV === 'local')
      && (process.env.NODE_DEV_SERVER === true)
  )
    ? 'render'
    : 'hydrate';

  let data = {};
  if (process.env.NODE_DEV_SERVER !== true) {
    try {
      const response = await fetch(`/store/${Math.floor(Date.now() / 3000000)}.json`);
      data = await response.json();
    } catch (error) {} // eslint-disable-line
  }

  const history = createHistory();
  const store = configureStore(data, history);

  ReactDOM[method](
    <AppContainer>
      <Root
        store={store}
        history={history}
      />
    </AppContainer>,
    document.getElementById('root'),
  );

  // Hot Module Replacement API
  if (module.hot) {
    module.hot.accept('../shared/Root', () => {
      const UpdatedRoot = require('Shared/Root').default; // eslint-disable-line
      ReactDOM.render(
        <AppContainer>
          <UpdatedRoot
            store={store}
            history={history}
          />
        </AppContainer>,
        document.getElementById('root'),
      );
    });
  }
})();
