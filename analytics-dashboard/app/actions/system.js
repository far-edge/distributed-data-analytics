import { createAction } from 'redux-actions';

const IS_UNAUTHORISED = 'IS_UNAUTHORISED';

export default {
  isUnauthorised: createAction(IS_UNAUTHORISED),
  IS_UNAUTHORISED
};

