import { handleActions } from 'redux-actions';

import actions from 'actions/analytics-processor-definitions';

const defaultState = {
  analyticsProcessorDefinitions: []
};

export default handleActions({
  [actions.setAnalyticsProcessorDefinitions]: (state, action) => {
    const analyticsProcessorDefinitions = action.payload;
    return { ...state, analyticsProcessorDefinitions };
  }
}, defaultState);
