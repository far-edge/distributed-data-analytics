import { createAction } from 'redux-actions';

const SET_DATA_SOURCE_DEFINITIONS = 'SET_DATA_SOURCE_DEFINITIONS';

export default {
  setDataSourceDefinitions: createAction(SET_DATA_SOURCE_DEFINITIONS),
  SET_DATA_SOURCE_DEFINITIONS
};
