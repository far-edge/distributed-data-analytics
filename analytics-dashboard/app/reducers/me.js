import { handleActions } from 'redux-actions';

import actions from 'actions/me';

const defaultState = {
  token: null,
  user: null
};

const signin = (state, action) => {
  return { ...state, token: action.payload };
};

const signout = (_state, _action) => {
  return defaultState;
};

export default handleActions({
  [actions.doSignin]: signin,
  [actions.signout]: signout
}, defaultState);
