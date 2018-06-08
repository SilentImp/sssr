import Helmet from 'react-helmet';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Test.pcss';

export class Test extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    changeLanguage: PropTypes.func.isRequired,
    locale: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    locale: 'en',
    className: '',
  };

  constructor(props) {
    super(props);
    this.toogleRu = this.toggle.bind(this, 'ru');
    this.toogleEn = this.toggle.bind(this, 'en');
  }

  state = {
    error: false,
  }

  componentDidMount() {
    this.props.change(this.onLocaleChange);
  }

  shouldComponentUpdate(props) {
    return (props.locale !== this.props.locale);
  }

  componentDidCatch() {
    this.setState({ error: true });
  }

  onLocaleChange = (language) => {
    console.warn('We are fetching localized data to Test component: ', language); // eslint-disable-line
  };

  toggle = (lang) => {
    const { changeLanguage } = this.props;
    changeLanguage(lang);
  };

  render() {
    const { t, className } = this.props;
    const { error } = this.state;
    if (error) return null;
    return (
      <section className={classNames(styles.Test, className)}>
        <Helmet>
          <title>{t('Home Page')}</title>
        </Helmet>
        <h1>{t('Test title')}</h1>
        <menu>
          <button onClick={this.toogleRu}>{t('RU')}</button>
          <button onClick={this.toggleEn}>{t('EN')}</button>
        </menu>
      </section>
    );
  }
}

export default Test;
