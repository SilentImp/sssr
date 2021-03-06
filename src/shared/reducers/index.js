import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import entities from './entities';

export default combineReducers({
  entities,
  form: formReducer,
  router: routerReducer,
});
