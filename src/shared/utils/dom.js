export const isEndOfPage = () => {
  const scrollTop = (
    window.pageYOffset
    || document.documentElement.scrollTop
    || document.body.scrollTop
  );

  const documentHeight = Math.max(
    document.body.scrollHeight || 0,
    document.documentElement.scrollHeight || 0,
    document.body.offsetHeight || 0,
    document.documentElement.offsetHeight || 0,
    document.body.clientHeight || 0,
    document.documentElement.clientHeight,
  );

  return window.innerHeight + scrollTop >= documentHeight - 230;
};

export default isEndOfPage;
