const Promise = require('bluebird');
const request = require('request-promise');

const AIM = require('../../workers/analytics-instance-manager');
const AnalyticsManifest = require('../../models/analytics-manifest');
const EdgeGateway = require('../../models/edge-gateway');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');

// Destroys a globally scoped analytics instance.
const _destroyGlobalAnalyticsInstance = (input) => {
  logger.debug('Destroy an analytics instance in the global scope.');
  return Promise.try(() => {
    // Find the analytics manifest with the given ID.
    return AnalyticsManifest.findById(input.id);
  }).then((analyticsManifest) => {
    // The analytics manifest does not exist.
    if (!analyticsManifest) {
      logger.error(`Analytics instance ${ input.id } does not exist.`);
      throw new errors.NotFoundError('ANALYTICS_INSTANCE_NOT_FOUND');
    }
    // Destroy the analytics instance.
    return AIM.destroyAnalyticsInstance(input.id).then(() => {
      return analyticsManifest;
    });
  }).then((analyticsManifest) => {
    // Delete the analytics manifest.
    return analyticsManifest.remove();
  }).then(() => {
    logger.debug(`Destroyed analytics instance ${ input.id } in the global scope.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to destroy analytics instance ${ input.id } in the global scope.`, error);
    throw error;
  });
};

// Destroys a locally scoped analytics instance.
const _destroyLocalAnalyticsInstance = (input) => {
  logger.debug(`Destroy an analytics instance in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
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
      uri: `${ edgeGateway.edgeAnalyticsEngineBaseURL }/analytics-instances/${ input.id }`
    });
  }).then((_response) => {
    logger.debug(`Destroyed analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to destroy analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`,
      error);
    throw error;
  });
};

// Destroys an analytics instance.
const destroyAnalyticsInstance = (input) => {
  logger.debug(`Destroy analytics instance ${ input.id }.`);
  return Promise.try(() => {
    return input.edgeGatewayReferenceID ? _destroyLocalAnalyticsInstance(input) :
      _destroyGlobalAnalyticsInstance(input);
  }).then(() => {
    logger.debug(`Destroyed analytics instance ${ input.id }.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to destroy analytics instance ${ input.id }.`, error);
    throw error;
  });
};

module.exports = destroyAnalyticsInstance;
