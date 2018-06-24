import { createSelector } from 'reselect';

const getToken = (state, _props) => {
  return state.me.token;
};

const makeIsLoggedIn = () => {
  return createSelector([ getToken ], (token) => {
    return true || !!token;
  });
};

export default {
  makeIsLoggedIn
};
