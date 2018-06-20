const exec = require('child-process-promise').exec;
const Promise = require('bluebird');

const AnalyticsManifest = require('../models/analytics-manifest');
const dataSourceDiscoverer = require('./data-source-discoverer');
const errors = require('../common/errors');
const logger = require('../common/loggers').get('ANALYTICS-RUNTIME');
const State = require('../models/state');

// The analytics instance table (AIT).
// The table maps analytics instance identification numbers (AIIDs) to analytics instance control
// blocks (AICBs).
const _ait = { };

// Starts the analytics processor with the given manifest.
const _startAnalyticsProcessor = (apm) => {
  logger.debug(`Start analytics processor ${ apm._id }.`);
  // NOTE: We assume that each processor has a single source.
  const dataSource = apm.dataSources.dataSource[0].dataSourceManifestReferenceID;
  const dataSink = apm.dataSink.dataSourceManifestReferenceID;
  return Promise.all([
    // Discover the data source.
    dataSourceDiscoverer.discoverDataSources({ id: dataSource }),
    // Discover the data sink.
    dataSourceDiscoverer.discoverDataSources({ id: dataSink })
  ]).spread((dataSources, dataSinks) => {
    // The data source does not exist.
    if (!dataSources.length) {
      logger.error(`Data source ${ dataSource } does not exist.`);
      throw new errors.BadRequestError('DATA_SOURCE_NOT_FOUND');
    }
    // The data sink does not exist.
    if (!dataSinks.length) {
      logger.error(`Data sink ${ dataSink } does not exist.`);
      throw new errors.BadRequestError('DATA_SINK_NOT_FOUND');
    }
    return { dataSource: dataSources[0], dataSink: dataSinks[0] };
  }).then(({ dataSource, dataSink }) => {
    // Collect the system properties.
    let properties = '';
    if (dataSource.dataSourceDefinitionInterfaceParameters &&
      dataSource.dataSourceDefinitionInterfaceParameters.parameter) {
      dataSource.dataSourceDefinitionInterfaceParameters.parameter.forEach((kv) => {
        properties = `${ properties } -Dfaredge.input.${ kv.key }=${ kv.value }`;
      });
    }
    if (dataSink.dataSourceDefinitionInterfaceParameters &&
      dataSink.dataSourceDefinitionInterfaceParameters.parameter) {
      dataSink.dataSourceDefinitionInterfaceParameters.parameter.forEach((kv) => {
        properties = `${ properties } -Dfaredge.output.${ kv.key }=${ kv.value }`;
      });
    }
    // Run the analytics processor.
    const p = exec(`java -jar ${ properties } ${ apm.processorLocation }`).catch((error) => {
      logger.error(`Something went wrong with analytics processor ${ apm._id }.`, error);
    });
    logger.debug(`Started analytics processor ${ apm._id }.`);
    return p.childProcess;
  }).catch((error) => {
    logger.error(`Failed to start analytics processor ${ apm._id }.`, error);
    throw error;
  });
};

// Creates the analytics instance with the given AIID.
const createAnalyticsInstance = (aiid) => {
  logger.debug(`Create analytics instance ${ aiid }.`);
  return Promise.try(() => {
    // Create the AICB for the analytics instance with the given AIID.
    const aicb = { processes: [], state: State.STOPPED };
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
      // The analytics instance is not stopped.
      if (aicb.state !== State.STOPPED) {
        logger.error(`Analytics instance ${ aiid } is not stopped.`);
        throw new errors.BadRequestError('ANALYTICS_INSTANCE_NOT_STOPPED');
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
    // The analytics instance is not stopped.
    if (aicb.state !== State.STOPPED) {
      logger.error(`Analytics instance ${ aiid } is not stopped.`);
      throw new errors.BadRequestError('ANALYTICS_INSTANCE_NOT_STOPPED');
    }
    // Start all processors.
    return Promise.map(analyticsManifest.analyticsProcessors.apm, (apm) => {
      return Promise.try(() => {
        return _startAnalyticsProcessor(apm);
      }).catch((error) => {
        logger.error(`Failed to start analytics processor ${ apm._id }.`, error);
        return null;
      });
    });
  }).then((processes) => {
    // Some of the analytics processors failed to start.
    if (processes.any((p) => { return p === null; })) {
      logger.error(`Failed to start some analytics processors for analytics instance ${ aiid }`);
      // Stop the ones that started.
      return Promise.map(processes.filter((p) => { return p !== null; }), (p) => {
        p.kill();
        return null;
      }).then(() => {
        throw new Error(`Failed to start analytics instance ${ aiid }.`);
      });
    }
    aicb.processes = processes;
    aicb.state = State.RUNNING;
    logger.debug(`Started analytics instance ${ aiid }.`);
    return null;
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
    return Promise.each(aicb.processes, (process) => {
      return Promise.try(() => {
        process.kill();
        return null;
      }).catch((error) => {
        logger.error(`Failed to stop analytics processor with PID ${ process.pid }.`, error);
        return null;
      });
    });
  }).then(() => {
    aicb.processes = [];
    aicb.state = State.STOPPED;
    logger.debug(`Stopped analytics instance ${ aiid }.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to stop analytics instance ${ aiid }.`, error);
    throw error;
  });
};

logger.info('Re-create all analytics instances.');
Promise.try(() => {
  // Find all analytics manifests.
  return AnalyticsManifest.find({});
}).then((analyticsManifests) => {
  // Create an AICB for each one of them.
  return Promise.each(analyticsManifests, (am) => {
    _ait[am._id] = { processes: [], state: State.STOPPED };
  });
}).then(() => {
  logger.info('Re-created all analytics instances.');
});

module.exports = {
  createAnalyticsInstance,
  destroyAnalyticsInstance,
  getAnalyticsInstanceState,
  startAnalyticsInstance,
  stopAnalyticsInstance
};
