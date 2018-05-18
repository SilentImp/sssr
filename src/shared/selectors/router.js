import { parse } from 'qs';

export const getRouterLocation = state => (
  state.router.location
);

export const getParsedRouterLocationSearch = state => (
  parse(state.router.location.search.substring(1))
);
