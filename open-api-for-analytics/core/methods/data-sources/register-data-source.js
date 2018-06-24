const Promise = require('bluebird');
const request = require('request-promise');

const common = require('./common');
const DataSourceManifest = require('../../models/data-source-manifest');
const EdgeGateway = require('../../models/edge-gateway');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('DATA-SOURCES');

// Registers a globally scoped data source.
const _registerGlobalDataSource = (input) => {
  logger.debug('Register a data source in the global scope.');
  return Promise.try(() => {
    // Create the data source manifest.
    const dataSourceManifest = new DataSourceManifest(input);
    // Validate the data source manifest.
    return common.validateDataSourceManifest(dataSourceManifest);
  }).then((dataSourceManifest) => {
    // Save the data source manifest.
    return dataSourceManifest.save();
  }).then((dataSourceManifest) => {
    logger.debug(`Registered data source ${ dataSourceManifest._id } in the global scope.`);
    return dataSourceManifest;
  }).catch((error) => {
    logger.error('Failed to register a data source in the global scope.', error);
    throw error;
  });
};

// Registers a locally scoped data source.
const _registerLocalDataSource = (input) => {
  logger.debug(`Register a data source in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
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
      method: 'POST',
      uri: `${ edgeGateway.dataRouterAndPreprocessorBaseURL }/data-sources`,
      body: input,
      json: true
    });
  }).then((response) => {
    // Fill in the edge gateway.
    return { ...response, edgeGatewayReferenceID: input.edgeGatewayReferenceID };
  }).then((dataSourceManifest) => {
    logger.debug(`Registered data source ${ dataSourceManifest._id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
    return dataSourceManifest;
  }).catch((error) => {
    logger.error(`Failed to register a data source in edge gateway ${ input.edgeGatewayReferenceID } local scope.`,
      error);
    throw error;
  });
};

// Registers a data source.
const registerDataSource = (input) => {
  logger.debug('Register a data source.');
  return Promise.try(() => {
    return input.edgeGatewayReferenceID ? _registerLocalDataSource(input) :
      _registerGlobalDataSource(input);
  }).then((dataSourceManifest) => {
    logger.debug(`Registered data source ${ dataSourceManifest._id }.`);
    return dataSourceManifest;
  }).catch((error) => {
    logger.error('Failed to register a data source.', error);
    throw error;
  });
};

module.exports = registerDataSource;
