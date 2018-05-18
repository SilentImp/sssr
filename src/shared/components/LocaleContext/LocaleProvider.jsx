import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const LocaleContext = React.createContext();

export class LocaleProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  state = {
    locale: 'en', // eslint-disable-line
    changeLocale: this.changeLocale, // eslint-disable-line
  };

  changeLocale = (locale) => {
    this.setState(state => ({
      ...state,
      locale,
    }));
  };

  render() {
    return (
      <LocaleContext.Provider value={this.state}>
        {this.props.children}
      </LocaleContext.Provider>
    );
  }
}

export default LocaleProvider;
