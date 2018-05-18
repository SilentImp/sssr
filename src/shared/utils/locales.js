export const convertLocaleToDBFormat = (locale = 'en') => {
  if (locale === 'ua') {
    return 'uk';
  } else if (locale === 'pt-br') {
    return 'pt';
  } else if (locale === 'cn') {
    return 'zh';
  } else if (locale === 'cz') {
    return 'cs';
  } else if (locale === 'se') {
    return 'sv';
  }

  return locale;
};

export const convertLocaleToAppFormat = (locale) => {
  if (locale === 'uk') {
    return 'ua';
  } else if (locale === 'pt') {
    return 'pt-br';
  } else if (locale === 'zh') {
    return 'cn';
  } else if (locale === 'cs') {
    return 'cz';
  } else if (locale === 'sv') {
    return 'se';
  }

  return locale;
};
