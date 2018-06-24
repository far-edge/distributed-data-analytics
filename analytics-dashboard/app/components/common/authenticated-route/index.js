import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

import { makeIsLoggedIn } from 'selectors/me';

const AuthenticatedRoute = ({ component: Component, isLoggedIn, ...rest }) => {
  const _render = (props) => {
    return isLoggedIn ? (
      <Component { ...props } />
    ) : (
      <Redirect to={ { pathname: '/' } } />
    );
  };
  return (
    <Route { ...rest } render={ _render } />
  );
};

const mapStateToProps = (state, props) => {
  const _isLoggedIn = makeIsLoggedIn();
  return {
    isLoggedIn: _isLoggedIn(state, props)
  };
};

const mapDispatchToProps = (_dispatch) => {
  return { };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthenticatedRoute));
