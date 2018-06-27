const exec = require('child-process-promise').exec;
const moment = require('moment');
const Promise = require('bluebird');

const DataSourceManifest = require('../../models/data-source-manifest');
const discoverDataSources = require('./discover-data-sources');
const errors = require('../../common/errors');
const { first } = require('../../common/chisels');
const logger = require('../../common/loggers').get('DATA-SOURCES');

// Finds a data source in the global or in any local scope.
// NOTE: We (wrongly) assume that a data source with the given ID can only exist in at most one
// scopes, which - at least in the currently implementation - is not correct.
const _findDataSource = (input) => {
  return Promise.try(() => {
    if (!input.edgeGatewayReferenceID) {
      // Look for it in the global scope.
      return DataSourceManifest.findById(input.id);
    }
    // Look for it in some local scope.
    return discoverDataSources(input).then(({ dataSources }) => {
      return first(dataSources);
    });
  });
};

// Gets data from a a data source.
const getDataFromDataSource = (input) => {
  logger.debug(`Get data from data source ${ input.id }.`);
  const N = 5;
  return Promise.try(() => {
    // Find the data source with the given ID.
    return _findDataSource(input);
  }).then((dataSource) => {
    // The data source does not exist.
    if (!dataSource) {
      logger.error(`Data source ${ input.id } does not exist.`);
      throw new errors.NotFoundError('DATA_SOURCE_NOT_FOUND');
    }
    const parameters = dataSource.dataSourceDefinitionInterfaceParameters.parameter;
    const host = first(parameters.filter((p) => { return p.key === 'host'; })).value;
    const topic = first(parameters.filter((p) => { return p.key === 'topic'; })).value;
    const port = first(parameters.filter((p) => { return p.key === 'port'; })).value;
    let command = `kafka-run-class kafka.tools.GetOffsetShell --broker-list ${ host }:${ port } --topic ${ topic }`;
    return exec(command).then((result) => {
      return result.stdout.split(':')[2];
    }).then((offset) => {
      const o = isNaN(offset - N) ? 0 : offset - N;
      command = `kafka-console-consumer --bootstrap-server ${ host }:${ port } --topic ${ topic } --offset ${ o } --partition 0 --timeout-ms 100 | grep -v ERROR | grep -v kafka.consumer.ConsumerTimeoutException`;
      return exec(command).then((result) => {
        return result.stdout.split('\n').filter((d) => { return !!d; }).map((d) => {
          const dataSet = JSON.parse(d);
          const observation = dataSet.observation[0];
          return { timestamp: moment(observation.timestamp).format('D-MMM-YY HH:mm:ss'), value: observation.value };
        });
      });
    });
  }).then((data) => {
    logger.debug(`Got data from data source ${ input.id }.`);
    return { data };
  }).catch((error) => {
    logger.error(`Failed to get data from data source ${ input.id }.`, error);
    return { data: [] };
  });
};

module.exports = getDataFromDataSource;
