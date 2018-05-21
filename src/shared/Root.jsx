import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import App from 'Components/App';

const Root = ({ store }) => (
  <Provider store={store}>
    <App />
  </Provider>
);

Root.propTypes = {
  store: PropTypes.shape({}).isRequired,
};

export default Root;
