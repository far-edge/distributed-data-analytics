import { createAction } from 'redux-actions';

const SET_DATA_KINDS = 'SET_DATA_KINDS';

export default {
  setDataKinds: createAction(SET_DATA_KINDS),
  SET_DATA_KINDS
};
