var fontFaceSet = document.fonts;
var FONT_NAME = 'PT Sans';

(function PreloadFonts() {
  function updateLocalStorage() {
    try {
      localStorage.setItem('font', FONT_NAME);
      document.documentElement.classList.add('font');
    } catch (error) {} // eslint-disable-line
  }

  function useObserver() {
    var FONT_NAME = 'PT Sans';
    var PTSans = new FontFaceObserver(FONT_NAME);
    var PTSansBold = new FontFaceObserver(FONT_NAME, {
      weight: 700,
    });
    var PTSansItalic = new FontFaceObserver(FONT_NAME, {
      style: 'italic',
    });
    var PTSansBoldItalic = new FontFaceObserver(FONT_NAME, {
      weight: 700,
      style: 'italic',
    });

    Promise.all([
      // PTSans.load(),
      PTSans.load('ё'),
      // PTSans.load('ö'),
      // PTSansBold.load(),
      // PTSansBold.load('ё'),
      // PTSansBold.load('ö'),
      // PTSansItalic.load(),
      // PTSansItalic.load('ё'),
      // PTSansItalic.load('ö'),
      // PTSansBoldItalic.load(),
      // PTSansBoldItalic.load('ё'),
      // PTSansBoldItalic.load('ö')
    ]).then(updateLocalStorage, function fontLoadError(result) {
      console.log('Can not load font: ', arguments);
    });
  }

  function isFontFaceSetCompatible() {
    var compatible = fontFaceSet !== undefined && fontFaceSet.load !== undefined;
    var AppleRegExp = new RegExp(/Apple/);
    if (compatible && AppleRegExp.test(window.navigator.vendor)) {
      var versionRegExp = new RegExp(/AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/);
      var match = versionRegExp.exec(window.navigator.userAgent);
      compatible = !(match && parseInt(match[1], 10) < 603);
    }
    return compatible;
  }

  var loadFont = function fontLoader() {
    if (isFontFaceSetCompatible()) {
      // basic latin
      fontFaceSet.load('1em PT Sans');
      fontFaceSet.load('bold 1em PT Sans');
      fontFaceSet.load('italic 1em PT Sans');
      fontFaceSet.load('italic bold 1em PT Sans');

      // cyrillic
      fontFaceSet.load('1em PT Sans', 'ё');
      fontFaceSet.load('bold 1em PT Sans', 'ё');
      fontFaceSet.load('italic 1em PT Sans', 'ё');
      fontFaceSet.load('italic bold 1em PT Sans', 'ё');

      // extended latin
      fontFaceSet.load('1em PT Sans', 'ö');
      fontFaceSet.load('bold 1em PT Sans', 'ö');
      fontFaceSet.load('italic 1em PT Sans', 'ö');
      fontFaceSet.load('italic bold 1em PT Sans', 'ö');

      fontFaceSet.ready.then(updateLocalStorage);
    } else {
      var script = document.createElement('SCRIPT');
      script.setAttribute('async', true);
      script.setAttribute('defer', true);
      script.setAttribute('src', 'javascript/fontfaceobserver.standalone.js');
      script.addEventListener('load', useObserver);
      document.body.appendChild(script);
    }
  };

  function isFontLoaded() {
    return (
      'fontDisplay' in document.documentElement.style ||
      (localStorage && localStorage.getItem('font') === FONT_NAME)
    );
  }

  if (!isFontLoaded()) {
    window.addEventListener('load', requestAnimationFrame.bind(this, loadFont));
  }
})();
