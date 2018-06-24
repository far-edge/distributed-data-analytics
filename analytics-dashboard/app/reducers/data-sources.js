import { handleActions } from 'redux-actions';

import actions from 'actions/data-sources';

const defaultState = {
  dataSources: []
};

export default handleActions({
  [actions.setDataSources]: (state, action) => {
    const dataSources = action.payload;
    return { ...state, dataSources };
  }
}, defaultState);
