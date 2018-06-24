const Promise = require('bluebird');
const request = require('request-promise');

const DataSourceManifest = require('../../models/data-source-manifest');
const EdgeGateway = require('../../models/edge-gateway');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('DATA-SOURCES');

// Unregisters a globally scoped data source.
const _unregisterGlobalDataSource = (input) => {
  logger.debug(`Unregister data source ${ input.id } in the global scope.`);
  return Promise.try(() => {
    // Find the data source manifest for the source with the given ID.
    return DataSourceManifest.findById(input.id);
  }).then((dataSourceManifest) => {
    // The data source manifest does not exist.
    if (!dataSourceManifest) {
      logger.error(`Data source ${ input.id } does not exist.`);
      throw new errors.NotFoundError('DATA_SOURCE_NOT_FOUND');
    }
    // Delete the data source manifest.
    return dataSourceManifest.remove();
  }).then(() => {
    logger.debug(`Unregistered data source ${ input.id } in the global scope.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to unregister data source ${ input.id } in the global scope.`, error);
    throw error;
  });
};

// Unregisters a locally scoped data source.
const _unregisterLocalDataSource = (input) => {
  logger.debug(`Unregister data source ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
  return Promise.try(() => {
    // Find the edge gateway with the given ID.
    return EdgeGateway.findById(input.edgeGatewayReferenceID);
  }).then((edgeGateway) => {
    // The edge gateway does not exist.
    if (!edgeGateway) {
      logger.error(`Edge gateway ${ input.id } does not exist.`);
      throw new errors.BadRequestError('EDGE_GATEWAY_NOT_FOUND');
    }
    // Forward the request to the edge gateway.
    return request({
      method: 'DELETE',
      uri: `${ edgeGateway.dataRouterAndPreprocessorBaseURL }/data-sources/${ input.id }`
    });
  }).then((_response) => {
    logger.debug(`Unregistered data source ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to unregister data source  ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`,
      error);
    throw error;
  });
};

// Unregisters a data source.
const unregisterDataSource = (input) => {
  logger.debug(`Unregister data source ${ input.id }.`);
  return Promise.try(() => {
    return input.edgeGatewayReferenceID ? _unregisterLocalDataSource(input) :
      _unregisterGlobalDataSource(input);
  }).then(() => {
    logger.debug(`Unregistered data source ${ input.id }.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to unregister data source ${ input.id }.`, error);
    throw error;
  });
};

module.exports = unregisterDataSource;
