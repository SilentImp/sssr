import i18n from 'Shared/i18n';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate } from 'react-i18next';

export const LocalizationContext = React.createContext();

translate.setI18n(i18n);

@translate()
class LocaleProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: null,
  };

  render() {
    const {
      t,
    } = this.props;

    return (
      <LocalizationContext.Provider value={{
        t,
        i18n,
        locale: i18n.language.split('-')[0],
        changeLanguage: (language, callback) => {
          if (i18n.language === language) return false;
          return i18n.changeLanguage(language, callback);
        },
        change: callback => (i18n.on('languageChanged', callback)),
      }}
      >
        {this.props.children}
      </LocalizationContext.Provider>
    );
  }
}

export default LocaleProvider;
