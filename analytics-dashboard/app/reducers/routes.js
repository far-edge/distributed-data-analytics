import { LOCATION_CHANGE, routerReducer } from 'react-router-redux';

const initialState = { };

export default (state = initialState, action) => {
  if (action.type === LOCATION_CHANGE) {
    return {
      ...state,
      routing: routerReducer(state.routing, action)
    };
  }

  return state;
};
