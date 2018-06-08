import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import App from 'Components/App';
import LocaleProvider from 'Components/LocaleContext';

import 'Styles/main.pcss';
import 'Styles/reset.css';

const Root = ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </ConnectedRouter>
  </Provider>
);

Root.propTypes = {
  history: PropTypes.shape({}).isRequired,
  store: PropTypes.shape({}).isRequired,
};

export default Root;
