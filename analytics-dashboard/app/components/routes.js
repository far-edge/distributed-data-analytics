import React from 'react';
import { Redirect, Route } from 'react-router';

import AuthenticatedRoute from 'components/common/authenticated-route';
import Dashboard from 'components/dashboard';

const Routes = () => {
  return (
    <div className='routes'>
      <Route
        exact
        path='/'
        render={ () => {
          return (
            <Redirect to='/dashboard/overview' />
          );
        } }
      />
      <AuthenticatedRoute path='/dashboard' component={ Dashboard } />
    </div>
  );
};

export default Routes;
