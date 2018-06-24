import React from 'react';
import ReduxToastr from 'react-redux-toastr';

import './messages';

const Messages = () => {
  return (
    <ReduxToastr
      newestOnTop
      timeOut={ 4000 }
      transitionIn='fadeIn'
      transitionOut='fadeOut'
      position='top-right'
      preventDuplicates
      progressBar={ false }
    />
  );
};

export default Messages;
