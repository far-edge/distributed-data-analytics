import { push } from 'react-router-redux';

import analyticsInstances from './analytics-instances';
import analyticsProcessorDefinitions from './analytics-processor-definitions';
import dataInterfaces from './data-interfaces';
import dataKinds from './data-kinds';
import dataSourceDefinitions from './data-source-definitions';
import dataSources from './data-sources';
import edgeGateways from './edge-gateways';
import me from './me';
import settings from './settings';
import system from './system';

const actions = {
  ...analyticsInstances,
  ...analyticsProcessorDefinitions,
  ...dataInterfaces,
  ...dataKinds,
  ...dataSourceDefinitions,
  ...dataSources,
  ...edgeGateways,
  me,
  push,
  ...settings,
  ...system
};

export default actions;
