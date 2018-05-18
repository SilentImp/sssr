import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from 'Reducers';

const devtools =
  (!process.env.IS_SERVER && process.env.NODE_ENV !== 'production' && (typeof window !== 'undefined') && window.devToolsExtension) ||
  (() => noop => noop);

export default function configureStore(initialState = {}, history) {
  const middlewares = [thunkMiddleware, routerMiddleware(history)];

  const enhancers = [applyMiddleware(...middlewares), devtools()];

  const store = createStore(rootReducer, initialState, compose(...enhancers));

  return store;
}
