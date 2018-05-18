import React from 'react';

import { LocaleContext } from './LocaleProvider';

export const withLocale = Component => props => (
  <LocaleContext.Consumer>
    {locale => (
      <Component
        {...props}
        locale={locale}
      />
    )}
  </LocaleContext.Consumer>
);

export default withLocale;
