const exec = require('child-process-promise').exec;
const Promise = require('bluebird');

const AnalyticsManifest = require('../models/analytics-manifest');
const DataSourceManifest = require('../models/data-source-manifest');
const dataSources = require('../methods/data-sources');
const errors = require('../common/errors');
const { first } = require('../common/chisels');
const logger = require('../common/loggers').get('ANALYTICS-RUNTIME');
const modelDiscoverer = require('./model-discoverer');
const State = require('../models/state');

// The analytics instance table (AIT).
// The table maps analytics instance identification numbers (AIIDs) to analytics instance control
// blocks (AICBs).
const _ait = { };

// Finds a data source in the global or in any local scope.
// NOTE: We (wrongly) assume that a data source with the given ID can only exist in at most one
// scopes, which - at least in the currently implementation - is not correct.
const _findDataSource = (id) => {
  return Promise.try(() => {
    // Look for it in the global scope.
    return DataSourceManifest.findById(id);
  }).then((dataSourceManifest) => {
    if (dataSourceManifest) {
      return dataSourceManifest;
    }
    // Look for it in any local scope.
    return dataSources.discoverDataSources({ id }).then(({ dataSources }) => {
      return first(dataSources);
    });
  });
};

// Starts the analytics processor with the given manifest that is part of tha analytics instance
// with the given AIID.
const _startAnalyticsProcessor = (aiid, analyticsProcessorManifest) => {
  logger.debug(`Start analytics processor ${ analyticsProcessorManifest._id }.`);
  const dataSourceIds = analyticsProcessorManifest.dataSources.dataSource.map((ds) => {
    return ds.dataSourceManifestReferenceID;
  });
  const dataSinkId = analyticsProcessorManifest.dataSink.dataSourceManifestReferenceID;
  const analyticsProcessorDefinitionId =
    analyticsProcessorManifest.analyticsProcessorDefinitionReferenceID;
  return Promise.all([
    // Find the data source manifests.
    Promise.map(dataSourceIds, _findDataSource),
    // Find the data sink manifest.
    _findDataSource(dataSinkId),
    // Discover the analytics processor definition.
    modelDiscoverer.discoverAnalyticsProcessorDefinitions({
      id: analyticsProcessorDefinitionId
    })
  ]).spread((dataSources, dataSink, analyticsProcessorDefinitions) => {
    // Some data source does not exist.
    if (dataSources.some((ds) => { return !ds; })) {
      logger.error('One or more data sources do not exist.');
      throw new errors.BadRequestError('DATA_SOURCE_NOT_FOUND');
    }
    // The data sink does not exist.
    if (!dataSink) {
      logger.error(`Data sink ${ dataSinkId } does not exist.`);
      throw new errors.BadRequestError('DATA_SINK_NOT_FOUND');
    }
    // The analytics processor definition does not exist.
    if (!analyticsProcessorDefinitions.length) {
      const apdId = analyticsProcessorDefinitionId;
      logger.error(`Analytics processor definition ${ apdId } does not exist.`);
      throw new errors.BadRequestError('ANALYTICS_PROCESSOR_DEFINITION_NOT_FOUND');
    }
    return {
      dataSources,
      dataSink,
      analyticsProcessorDefinition: analyticsProcessorDefinitions[0]
    };
  }).then(({ dataSources, dataSink, analyticsProcessorDefinition }) => {
    // Put together the system properties.
    let properties = '';
    // Put the analytics processor ID to the system property faredge.processor.id.
    properties = `${ properties } -Dfaredge.processor.id=${ analyticsProcessorManifest._id }`;
    // Put the data sink ID to the system property faredge.sink.id.
    properties = `${ properties } -Dfaredge.sink.id=${ dataSinkId }`;
    // Put the the value for a parameter x that is passed to one of the data sources of the
    // analytics processor to the system property faredge.input.$.x, where $ is the index of the
    // data source.
    dataSources.forEach((ds, index) => {
      if (ds.dataSourceDefinitionInterfaceParameters &&
        ds.dataSourceDefinitionInterfaceParameters.parameter) {
        ds.dataSourceDefinitionInterfaceParameters.parameter.forEach((kv) => {
          properties = `${ properties } -Dfaredge.input.${ index }.${ kv.key }=${ kv.value }`;
        });
      }
    });
    // Put the value for a parameter x that is passed to the data sink of the analytics processor
    // to the system property faredge.output.x.
    if (dataSink.dataSourceDefinitionInterfaceParameters &&
      dataSink.dataSourceDefinitionInterfaceParameters.parameter) {
      dataSink.dataSourceDefinitionInterfaceParameters.parameter.forEach((kv) => {
        properties = `${ properties } -Dfaredge.output.${ kv.key }=${ kv.value }`;
      });
    }
    // Put the value for a parameter x that is passed to the analytics processor itself to the
    // system property faredge.x.
    if (analyticsProcessorManifest.parameters &&
      analyticsProcessorManifest.parameters.parameter) {
      analyticsProcessorManifest.parameters.parameter.forEach((kv) => {
        properties = `${ properties } -Dfaredge.${ kv.key }=${ kv.value }`;
      });
    }
    // Run the analytics processor.
    const command = `java -jar ${ properties } ${ analyticsProcessorDefinition.processorLocation }`;
    logger.debug(`Start analytics processor ${ analyticsProcessorManifest._id } with the command ${ command }.`);
    const p = exec(command).then(() => {
      logger.debug(`Analytics processor ${ analyticsProcessorManifest._id } stopped.`);
      // The processor stopped.
      _ait[aiid].processors[analyticsProcessorManifest._id].state = State.STOPPED;
      _ait[aiid].state = _ait[aiid].processors.some((p) => { return p.state === State.FAILED; }) ?
        State.FAILED : State.STOPPED;
    }).catch((error) => {
      logger.error(`Something went wrong with analytics processor ${ analyticsProcessorManifest._id }.`, error);
      _ait[aiid].processors[analyticsProcessorManifest._id].state = State.FAILED;
      _ait[aiid].state = State.FAILED;
    });
    _ait[aiid].processors[analyticsProcessorManifest._id].process = p.childProcess;
    _ait[aiid].processors[analyticsProcessorManifest._id].state = State.RUNNING;
    logger.debug(`Started analytics processor ${ analyticsProcessorManifest._id }.`);
    return { process: p.childProcess, state: State.RUNNING };
  }).catch((error) => {
    logger.error(`Failed to start analytics processor ${ analyticsProcessorManifest._id }.`, error);
    throw error;
  });
};

// Creates the analytics instance with the given AIID.
const createAnalyticsInstance = (aiid) => {
  logger.debug(`Create analytics instance ${ aiid }.`);
  return Promise.try(() => {
    // Create the AICB for the analytics instance with the given AIID.
    const aicb = { processors: {}, state: State.STOPPED };
    // Put it into the AIT.
    _ait[aiid] = aicb;
    logger.debug(`Created analytics instance ${ aiid }.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to create analytics instance ${ aiid }.`, error);
    throw error;
  });
};

// Destroys the analytics instance with the given AIID.
const destroyAnalyticsInstance = (aiid) => {
  logger.debug(`Destroy analytics instance ${ aiid }.`);
  return Promise.try(() => {
    // Find the AICB for the analytics instance with the given AIID.
    const aicb = _ait[aiid];
    if (aicb) {
      // The analytics instance is running.
      if (aicb.state === State.RUNNING) {
        logger.error(`Analytics instance ${ aiid } is running.`);
        throw new errors.BadRequestError('ANALYTICS_INSTANCE_RUNNING');
      }
      // Remove the AICB from the AIT.
      delete _ait[aiid];
    } else {
      // There is no AICB for the given AIID.
      // Say it has been destroyed.
      logger.warn(`Analytics instance ${ aiid } has no AICB.`);
    }
    logger.debug(`Destroyed analytics instance ${ aiid }.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to destroy analytics instance ${ aiid }.`, error);
    throw error;
  });
};

// Gets the state of the analytics instance with the given AIID.
const getAnalyticsInstanceState = (aiid) => {
  logger.debug(`Gets state of analytics instance ${ aiid }.`);
  return Promise.try(() => {
    // Find the AICB for the analytics instance with the given AIID.
    const aicb = _ait[aiid];
    // There is no AICB for the given AIID.
    if (!aicb) {
      logger.error(`Analytics instance ${ aiid } has no AICB.`);
      throw new errors.NotFoundError('ANALYTICS_INSTANCE_NOT_FOUND');
    }
    logger.debug(`Got state of analytics instance ${ aiid }.`);
    return aicb.state;
  }).catch((error) => {
    logger.error(`Failed to get state of analytics instance ${ aiid }.`, error);
    throw error;
  });
};

// Initialises everything.
const init = () => {
  logger.info('Re-create all analytics instances.');
  return Promise.try(() => {
    // Find all analytics manifests.
    return AnalyticsManifest.find({});
  }).then((analyticsManifests) => {
    // Create an AICB for each one of them.
    return Promise.each(analyticsManifests, (am) => {
      logger.debug(`Re-create analytics instance ${ am._id }.`);
      _ait[am._id] = { processors: {}, state: State.STOPPED };
    });
  }).then(() => {
    logger.info('Re-created all analytics instances.');
    return null;
  });
};

// Starts the analytics instance with the given AIID.
const startAnalyticsInstance = (aiid) => {
  logger.debug(`Start analytics instance ${ aiid }.`);
  // Find the AICB for the analytics instance with the given AIID.
  const aicb = _ait[aiid];
  return Promise.try(() => {
    // Find the analytics manifest with the given ID.
    return AnalyticsManifest.findById(aiid);
  }).then((analyticsManifest) => {
    // The analytics manifest does not exist.
    if (!analyticsManifest) {
      logger.error(`Analytics instance ${ aiid } does not exist.`);
      throw new errors.NotFoundError('ANALYTICS_INSTANCE_NOT_FOUND');
    }
    // There is no AICB for the given AIID.
    if (!aicb) {
      logger.error(`Analytics instance ${ aiid } has no AICB.`);
      throw new errors.NotFoundError('ANALYTICS_INSTANCE_NOT_FOUND');
    }
    // The analytics instance is running.
    if (aicb.state === State.RUNNING) {
      logger.error(`Analytics instance ${ aiid } is running.`);
      throw new errors.BadRequestError('ANALYTICS_INSTANCE_RUNNING');
    }
    aicb.processors = analyticsManifest.analyticsProcessors.apm.reduce((acc, apm) => {
      return { ...acc, [ apm._id ]: { process: null, state: State.STOPPED } };
    }, {});
    aicb.state = State.STOPPED;
    // Start all analytics processors.
    return Promise.each(analyticsManifest.analyticsProcessors.apm, (apm) => {
      return Promise.try(() => {
        return _startAnalyticsProcessor(aiid, apm);
      }).catch((error) => {
        logger.error(`Failed to start analytics processor ${ apm._id }.`, error);
        aicb.processors[apm._id] = {
          ...aicb.processors[apm._id],
          ...{
            state: State.FAILED,
            process: null
          }
        };
        return null;
      });
    });
  }).then(() => {
    // All analytics processors have started.
    if (Object.keys(aicb.processors).every((id) => {
      return aicb.processors[id].state === State.RUNNING;
    })) {
      aicb.state = State.RUNNING;
      logger.debug(`Started analytics instance ${ aiid }.`);
      return null;
    }
    // Some of the analytics processors failed to start.
    logger.error(`Failed to start some analytics processors for analytics instance ${ aiid }`);
    // Stop the ones that started.
    return Promise.map(Object.keys(aicb.processors).filter((id) => {
      return aicb.processors[id].state === State.RUNNING;
    }), (id) => {
      aicb.processors[id].process.kill();
      return null;
    }).then(() => {
      aicb.state = Object.keys(aicb.processors).some((id) => {
        return aicb.processors[id].state === State.FAILED;
      }) ? State.FAILED : State.STOPPED;
      aicb.processors = {};
      throw new Error(`Failed to start analytics instance ${ aiid }.`);
    });
  }).catch((error) => {
    logger.error(`Failed to start analytics instance ${ aiid }.`, error);
    throw error;
  });
};

// Stops the analytics instance with the given AIID.
const stopAnalyticsInstance = (aiid) => {
  logger.debug(`Stop analytics instance ${ aiid }.`);
  // Find the AICB for the analytics instance with the given AIID.
  const aicb = _ait[aiid];
  return Promise.try(() => {
    // There is no AICB for the given AIID.
    if (!aicb) {
      logger.error(`Analytics instance ${ aiid } has no AICB.`);
      throw new errors.NotFoundError('ANALYTICS_INSTANCE_NOT_FOUND');
    }
    // The analytics instance is not running.
    if (aicb.state !== State.RUNNING) {
      logger.error(`Analytics instance ${ aiid } is not running.`);
      throw new errors.BadRequestError('ANALYTICS_INSTANCE_NOT_RUNNING');
    }
    // Stop all processors.
    // NOTE: Do your best.
    return Promise.each(Object.keys(aicb.processors), (id) => {
      return Promise.try(() => {
        aicb.processors[id].process.kill();
        return null;
      }).catch((error) => {
        logger.error(`Failed to stop analytics processor with PID ${ process.pid }.`, error);
        return null;
      });
    });
  }).then(() => {
    aicb.processors = [];
    aicb.state = State.STOPPED;
    logger.debug(`Stopped analytics instance ${ aiid }.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to stop analytics instance ${ aiid }.`, error);
    throw error;
  });
};

// Shuts everything down.
const shutDown = () => {
  logger.info('Stop all running analytics instances.');
  Object.keys(_ait).forEach((aiid) => {
    const aicb = _ait[aiid];
    if (aicb.state !== State.RUNNING) {
      return;
    }
    logger.debug(`Stop analytics instance ${ aiid }.`);
    Object.keys(aicb.processors).forEach((id) => {
      aicb.processors[id].process.kill();
    });
  });
  logger.info('Stopped all running analytics instances.');
};

module.exports = {
  createAnalyticsInstance,
  destroyAnalyticsInstance,
  getAnalyticsInstanceState,
  init,
  shutDown,
  startAnalyticsInstance,
  stopAnalyticsInstance
};
