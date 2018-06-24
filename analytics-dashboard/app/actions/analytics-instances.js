import { createAction } from 'redux-actions';

const SET_ANALYTICS_INSTANCES = 'SET_ANALYTICS_INSTANCES';

export default {
  setAnalyticsInstances: createAction(SET_ANALYTICS_INSTANCES),
  SET_ANALYTICS_INSTANCES
};
