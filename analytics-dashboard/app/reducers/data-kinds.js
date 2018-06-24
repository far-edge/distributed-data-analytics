import { handleActions } from 'redux-actions';

import actions from 'actions/data-kinds';

const defaultState = {
  dataKinds: []
};

export default handleActions({
  [actions.setDataKinds]: (state, action) => {
    const dataKinds = action.payload;
    return { ...state, dataKinds };
  }
}, defaultState);
