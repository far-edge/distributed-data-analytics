import { handleActions } from 'redux-actions';

import { defaultLanguage } from 'helpers/languages';
import actions from 'actions/settings';

const defaultState = {
  language: defaultLanguage
};

const setLanguage = (state, action) => {
  return { ...state, language: action.payload };
};

export default handleActions({
  [actions.setLanguage]: setLanguage
}, defaultState);
