const Promise = require('bluebird');

const DataSourceManifest = require('../../models/data-source-manifest');
const logger = require('../../common/loggers').get('DATA-SOURCES');

// Discovers data sources.
const discoverDataSources = (input) => {
  logger.debug('Discover data sources.');
  return Promise.try(() => {
    // Find the data source manifests that match the given criteria.
    return DataSourceManifest.find({
      ...(input.id ? { _id: input.id } : { }),
      ...(input.name ? { name: input.name } : { }),
      ...(input.dataSourceDefinitionReferenceID ? {
        dataSourceDefinitionReferenceID: input.dataSourceDefinitionReferenceID
      } : { })
    });
  }).then((dataSourcesManifests) => {
    logger.debug('Discovered data sources.');
    return { dataSources: dataSourcesManifests };
  }).catch((error) => {
    logger.error('Failed to discover data sources.', error);
    throw error;
  });
};

module.exports = discoverDataSources;
