import { createAction } from 'redux-actions';

const SET_LANGUAGE = 'SET_LANGUAGE';

export default {
  setLanguage: createAction(SET_LANGUAGE),
  SET_LANGUAGE
};
