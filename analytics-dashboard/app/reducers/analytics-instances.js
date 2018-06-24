import { handleActions } from 'redux-actions';

import actions from 'actions/analytics-instances';

const defaultState = {
  analyticsInstances: []
};

export default handleActions({
  [actions.setAnalyticsInstances]: (state, action) => {
    const analyticsInstances = action.payload;
    return { ...state, analyticsInstances };
  }
}, defaultState);
