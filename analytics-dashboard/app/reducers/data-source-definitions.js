import { handleActions } from 'redux-actions';

import actions from 'actions/data-source-definitions';

const defaultState = {
  dataSourceDefinitions: []
};

export default handleActions({
  [actions.setDataSourceDefinitions]: (state, action) => {
    const dataSourceDefinitions = action.payload;
    return { ...state, dataSourceDefinitions };
  }
}, defaultState);
