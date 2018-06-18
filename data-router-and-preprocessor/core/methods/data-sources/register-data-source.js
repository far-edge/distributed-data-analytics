const Promise = require('bluebird');

const common = require('./common');
const dataRouter = require('../../workers/data-router');
const DataSourceManifest = require('../../models/data-source-manifest');
const logger = require('../../common/loggers').get('DATA-SOURCES');

// Registers a data source.
const registerDataSource = (input) => {
  logger.debug('Register a data source.');
  return Promise.try(() => {
    // Create the data source manifest.
    const dataSourceManifest = new DataSourceManifest(input);
    // Validate the data source manifest.
    return common.validateDataSourceManifest(dataSourceManifest);
  }).then((dataSourceManifest) => {
    // Save the data source manifest.
    return dataSourceManifest.save();
  }).then((dataSourceManifest) => {
    // Set up the data route from the new data source.
    return dataRouter.setUpDataRoute(dataSourceManifest).then(() => {
      return dataSourceManifest;
    });
  }).then((dataSourceManifest) => {
    logger.debug(`Registered data source ${ dataSourceManifest._id }.`);
    return dataSourceManifest;
  }).catch((error) => {
    logger.error('Failed to register a data source.', error);
    throw error;
  });
};

module.exports = registerDataSource;
