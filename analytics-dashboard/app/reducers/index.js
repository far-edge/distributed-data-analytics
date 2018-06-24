import { combineReducers } from 'redux';

import { ME_SIGNOUT } from 'actions/me';
import analyticsInstances from './analytics-instances';
import analyticsProcessorDefinitions from './analytics-processor-definitions';
import dataInterfaces from './data-interfaces';
import dataKinds from './data-kinds';
import dataSourceDefinitions from './data-source-definitions';
import dataSources from './data-sources';
import edgeGateways from './edge-gateways';
import me from './me';
import resettableReducer from './resettable';
import routing from './routes';
import settings from './settings';

const resettable = resettableReducer(ME_SIGNOUT);

const appReducer = combineReducers({
  analyticsInstances,
  analyticsProcessorDefinitions,
  dataInterfaces,
  dataKinds,
  dataSourceDefinitions,
  dataSources,
  edgeGateways,
  me: resettable(me),
  routing,
  settings: resettable(settings)
});

export default appReducer;
