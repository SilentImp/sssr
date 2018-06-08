import React from 'react';
import { LocalizationContext } from 'Components/LocaleContext';

import TestBase from './Test';

const Test = props => (
  <LocalizationContext.Consumer>
    {context => (
      <TestBase
        t={context.t}
        i18n={context.i18n}
        locale={context.locale}
        change={context.change}
        changeLanguage={context.changeLanguage}
        {...props}
      />)}
  </LocalizationContext.Consumer>
);

export default Test;
