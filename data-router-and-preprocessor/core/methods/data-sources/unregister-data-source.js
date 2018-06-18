const Promise = require('bluebird');

const dataRouter = require('../../workers/data-router');
const DataSourceManifest = require('../../models/data-source-manifest');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('DATA-SOURCES');

// Unregisters a data source.
const unregisterDataSource = (input) => {
  logger.debug(`Unregister data source ${ input.id }.`);
  return Promise.try(() => {
    // Find the data source manifest for the source with the given ID.
    return DataSourceManifest.findById(input.id);
  }).then((dataSourceManifest) => {
    // The data source manifest does not exist.
    if (!dataSourceManifest) {
      logger.error(`Data source ${ input.id } does not exist.`);
      throw new errors.NotFoundError('DATA_SOURCE_NOT_FOUND');
    }
    // Tear down the data route that starts from the data source.
    return dataRouter.tearDownDataRoute(dataSourceManifest).then(() => {
      return dataSourceManifest;
    });
  }).then((dataSourceManifest) => {
    // Delete the data source manifest.
    return dataSourceManifest.remove();
  }).then(() => {
    logger.debug(`Unregistered data source ${ input.id }.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to unregister data source ${ input.id }.`, error);
    throw error;
  });
};

module.exports = unregisterDataSource;
