import merge from 'lodash/merge';
// import * as types from 'types';

const initialState = {
};

export default (state = initialState, action) => {
  if (action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }

  return state;
};
