import createBrowserHistory from 'history/createBrowserHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import 'semantic-ui-css/semantic.min.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min';
import 'react-select2-wrapper/css/select2.min';
import 'react-table/react-table.css';

import { isUnauthorised } from 'actions/system';
import Main from 'components';
import Messages from 'components/common/messages';
import { setLanguage } from 'helpers/languages';
import { bindUnauthorised } from 'helpers/requests';
import configureStore from 'store';

import 'extensions/styles/index';

// Build the store and history.
const history = createBrowserHistory();
const store = configureStore({ }, history);

// Perform initialisations.
setLanguage(store.getState().settings.language);
bindUnauthorised(() => {
  store.dispatch(isUnauthorised());
});

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={ store }>
        <div className='root'>
          <ConnectedRouter history={ history }>
            <Component />
          </ConnectedRouter>
          <Messages />
        </div>
      </Provider>
    </AppContainer>,
    document.getElementById('react-root'),
  );
};
render(Main);
