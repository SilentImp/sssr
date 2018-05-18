import templateStyle from 'shared/template/style.pug';
import stylesMain from 'Styles/main.pcss';
import stylesReset from 'reset.css';

function lengthInUtf8Bytes(str) {
  const m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (
    m
      ? m.length
      : 0);
}

export default function getContext({ res, include, exclude }) {
  const Critical = ['TMLibraryAppHeader', 'AppSearchForm', 'Footer', 'Header', 'Navigation', 'SharePages'].concat(include);
  const CSSSizeLimit = (typeof process.env.CSS_SIZE_LIMIT !== 'undefined')
    ? process.env.CSS_SIZE_LIMIT
    : 250;
  const css = new Set();
  css.add(stylesReset._getCss());
  let cssLength = lengthInUtf8Bytes(stylesReset._getCss());
  css.add(stylesMain._getCss());
  cssLength += lengthInUtf8Bytes(stylesMain._getCss());
  return {
    css,
    context: {
      insertCss: (...styles) => {
        let set = '';
        const sheet = [...css].join('');
        styles.forEach((style) => {
          let isCritical = false;
          let isExcluded = false;
          const cssString = style._getCss();
          const cssSize = lengthInUtf8Bytes(cssString);

          if (sheet.indexOf(cssString) > -1) { return; }

          exclude.forEach((item) => {
            if (cssString.indexOf(item) > -1) { isExcluded = true; }
          });

          if (isExcluded) { return; }

          Critical.forEach((item) => {
            if (cssString.indexOf(item) > -1) { isCritical = true; }
          });

          if (
            ((cssSize + cssLength) / 1024 > CSSSizeLimit)
            && !isCritical
          ) {
            return;
          }

          cssLength += cssSize;
          set += cssString;
        });

        res.write(templateStyle({ styles: set }));
      },
    },
  };
}
