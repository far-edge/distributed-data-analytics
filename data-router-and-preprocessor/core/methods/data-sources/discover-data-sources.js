const Promise = require('bluebird');

const DataSourceManifest = require('../../models/data-source-manifest');
const logger = require('../../common/loggers').get('DATA-SOURCES');

// Discovers data sources.
const discoverDataSources = (input) => {
  logger.debug('Discover data sources.');
  return Promise.try(() => {
    // Find the data sources that match the given criteria.
    return DataSourceManifest.find({
      ...(input.id ? { _id: input.id } : { }),
      ...(input.dataSourceDefinitionReferenceID ? {
        dataSourceDefinitionReferenceID: input.dataSourceDefinitionReferenceID
      } : { })
    });
  }).then((dataSources) => {
    logger.debug('Discovered data sources.');
    return { dataSources };
  }).catch((error) => {
    logger.error('Failed to discover data sources.', error);
    throw error;
  });
};

module.exports = discoverDataSources;
