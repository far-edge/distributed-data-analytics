const Promise = require('bluebird');
const request = require('request-promise');

const AIM = require('../../workers/analytics-instance-manager');
const EdgeGateway = require('../../models/edge-gateway');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');

// Stops a globally scoped analytics instance.
const _stopGlobalAnalyticsInstance = (input) => {
  logger.debug('Start an analytics instance in the global scope.');
  return Promise.try(() => {
    // Start the analytics instance with the given ID.
    return AIM.startAnalyticsInstance(input.id);
  }).then(() => {
    logger.debug(`Started analytics instance ${ input.id } in the global scope.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to start analytics instance ${ input.id } in the global scope.`, error);
    throw error;
  });
};

// Stops a locally scoped analytics instance.
const _stopLocalAnalyticsInstance = (input) => {
  logger.debug(`Start an analytics instance in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
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
      uri: `${ edgeGateway.edgeAnalyticsEngineBaseURL }/analytics-instances/${ input.id }/start`
    });
  }).then((_response) => {
    logger.debug(`Started analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to start analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`,
      error);
    throw error;
  });
};

// Starts an analytics instance.
const startAnalyticsInstance = (input) => {
  logger.debug(`Start analytics instance ${ input.id }.`);
  return Promise.try(() => {
    return input.edgeGatewayReferenceID ? _stopLocalAnalyticsInstance(input) :
      _stopGlobalAnalyticsInstance(input);
  }).then(() => {
    logger.debug(`Started analytics instance ${ input.id }.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to start analytics instance ${ input.id }.`, error);
    throw error;
  });
};

module.exports = startAnalyticsInstance;
