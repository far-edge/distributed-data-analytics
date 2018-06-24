import { createAction } from 'redux-actions';

const SET_ANALYTICS_PROCESSOR_DEFINITIONS = 'SET_ANALYTICS_PROCESSOR_DEFINITIONS';

export default {
  setAnalyticsProcessorDefinitions: createAction(SET_ANALYTICS_PROCESSOR_DEFINITIONS),
  SET_ANALYTICS_PROCESSOR_DEFINITIONS
};
