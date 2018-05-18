export function xssDefender(string) {
  const symbols = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '/': '&#x2F;',
    '"': '&quot;',
    "'": '&#x27;',
  };
  const regExp = /[&<>"'/]/ig;

  if (regExp.test(string)) {
    return string.replace(regExp, value => symbols[value]);
  }
  return string;
}

export default xssDefender;
