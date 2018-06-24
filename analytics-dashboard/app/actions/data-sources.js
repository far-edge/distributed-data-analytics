import { createAction } from 'redux-actions';

const SET_DATA_SOURCES = 'SET_DATA_SOURCES';

export default {
  setDataSources: createAction(SET_DATA_SOURCES),
  SET_DATA_SOURCES
};
