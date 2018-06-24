import { handleActions } from 'redux-actions';

import actions from 'actions/data-interfaces';

const defaultState = {
  dataInterfaces: []
};

export default handleActions({
  [actions.setDataInterfaces]: (state, action) => {
    const dataInterfaces = action.payload;
    return { ...state, dataInterfaces };
  }
}, defaultState);
