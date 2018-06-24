import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import actions from 'actions';
import enhancers from 'enhancers';
import { send } from 'helpers/requests';
import middlewares from 'middlewares';
import reducers from 'reducers';
import subscribers from 'subscribers';

const configureStore = (state, history) => {
  const env = process.env.NODE_ENV;

  const allMiddlewares = [
    thunk.withExtraArgument(send),
    routerMiddleware(history),
    ...middlewares
  ];
  if (env === 'development') {
    const logger = createLogger({
      level: 'info',
      collapsed: true
    });
    allMiddlewares.push(logger);
  }

  const hasReduxDevtools = typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  let composeEnhancers = (env === 'development' && hasReduxDevtools) ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actions }) :
    compose;
  const enhancer = composeEnhancers(applyMiddleware(...allMiddlewares), ...enhancers);

  const store = createStore(reducers, state, enhancer);

  store.subscribe(subscribers);

  return store;
};

export default configureStore;
