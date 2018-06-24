import React from 'react';

import AuthenticatedRoute from 'components/common/authenticated-route';
import Dashboard from 'components/dashboard';

const Routes = () => {
  return (
    <div className='routes'>
      <AuthenticatedRoute path='/dashboard' component={ Dashboard } />
    </div>
  );
};

export default Routes;
