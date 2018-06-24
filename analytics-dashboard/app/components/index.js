import React from 'react';
import Favicon from 'react-favicon';
import { Helmet } from 'react-helmet';

import Routes from 'components/routes';
import favicon from 'extensions/images/favicon.ico';
import { tr } from 'helpers/languages';

const Main = () => {
  return (
    <div className='main'>
      <Favicon url={ favicon } />
      <Helmet>
        <meta charSet='utf-8' />
        <title>{ tr('THE_TITLE') }</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Helmet>
      <Routes />
    </div>
  );
};

export default Main;
