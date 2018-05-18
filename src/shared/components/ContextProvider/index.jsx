import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ContextProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    context: PropTypes.shape({}),
  };

  static childContextTypes = {
    insertCss: PropTypes.func,
  }

  static defaultProps = {
    children: null,
    context: {},
  };

  getChildContext() {
    return { ...this.props.context };
  }

  render() {
    const { children, ...props } = this.props;
    return React.cloneElement(children, props);
  }
}
