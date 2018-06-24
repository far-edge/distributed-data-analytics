import { handleActions } from 'redux-actions';

import actions from 'actions/edge-gateways';

const defaultState = {
  edgeGateways: []
};

export default handleActions({
  [actions.setEdgeGateways]: (state, action) => {
    const edgeGateways = action.payload;
    return { ...state, edgeGateways };
  }
}, defaultState);
