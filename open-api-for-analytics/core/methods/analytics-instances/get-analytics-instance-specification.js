const Promise = require('bluebird');
const request = require('request-promise');

const AnalyticsManifest = require('../../models/analytics-manifest');
const EdgeGateway = require('../../models/edge-gateway');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');

// Gets the specification ofa globally scoped analytics instance.
const _getGlobalAnalyticsInstanceSpecification = (input) => {
  logger.debug(`Get specification of analytics instance ${ input.id } in the global scope.`);
  return Promise.try(() => {
    // Find the analytics manifest with the given ID.
    return AnalyticsManifest.findById(input.id);
  }).then((analyticsManifest) => {
    // The analytics manifest does not exist.
    if (!analyticsManifest) {
      logger.error(`Analytics instance ${ input.id } does not exist.`);
      throw new errors.NotFoundError('ANALYTICS_INSTANCE_NOT_FOUND');
    }
    logger.debug(`Got specification of analytics instance ${ input.id } in the global scope.`);
    return analyticsManifest;
  }).catch((error) => {
    logger.error(`Failed to get specification of analytics instance ${ input.id } in the global scope.`, error);
    throw error;
  });
};

// Gets the specification ofa locally scoped analytics instance.
const _getLocalAnalyticsInstanceSpecification = (input) => {
  logger.debug(`Get specification of analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
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
      method: 'GET',
      uri: `${ edgeGateway.edgeAnalyticsEngineBaseURL }/analytics-instances/${ input.id }/specification`,
      json: true
    });
  }).then((response) => {
    // Fill in the edge gateway.
    return { ...response, edgeGatewayReferenceID: input.edgeGatewayReferenceID };
  }).then((analyticsManifest) => {
    logger.debug(`Got specification of analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
    return analyticsManifest;
  }).catch((error) => {
    logger.error(`Failed to get specification of analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`,
      error);
    throw error;
  });
};

// Gets the specification of an analytics instance.
const getAnalyticsInstanceSpecification = (input) => {
  logger.debug(`Get specification of analytics instance ${ input.id }.`);
  return Promise.try(() => {
    return input.edgeGatewayReferenceID ? _getLocalAnalyticsInstanceSpecification(input) :
      _getGlobalAnalyticsInstanceSpecification(input);
  }).then((analyticsManifest) => {
    logger.debug(`Got specification of analytics instance ${ input.id }.`);
    return analyticsManifest;
  }).catch((error) => {
    logger.error(`Failed to get specification of analytics instance ${ input.id }.`, error);
    throw error;
  });
};

module.exports = getAnalyticsInstanceSpecification;
