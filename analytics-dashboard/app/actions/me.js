import { createAction } from 'redux-actions';

const ME_SIGNOUT = 'ME_SIGNOUT';

const signin = createAction('ME_SIGNIN');

const signout = createAction(ME_SIGNOUT);

export default {
  ME_SIGNOUT,
  signin,
  signout,
};
