const Promise = require('bluebird');
const request = require('request-promise');

const AIM = require('../../workers/analytics-instance-manager');
const AnalyticsManifest = require('../../models/analytics-manifest');
const EdgeGateway = require('../../models/edge-gateway');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');

// Gets a globally scoped analytics instance.
const _getGlobalAnalyticsInstance = (input) => {
  logger.debug(`Get analytics instance ${ input.id } in the global scope.`);
  return Promise.try(() => {
    // Find the analytics manifest with the given ID.
    return AnalyticsManifest.findById(input.id);
  }).then((analyticsManifest) => {
    // The analytics manifest does not exist.
    if (!analyticsManifest) {
      logger.error(`Analytics instance ${ input.id } does not exist.`);
      throw new errors.NotFoundError('ANALYTICS_INSTANCE_NOT_FOUND');
    }
    // Get the state of the analytics instance.
    return AIM.getAnalyticsInstanceState(analyticsManifest._id).then((state) => {
      return { analyticsManifest, state };
    });
  }).then(({ analyticsManifest, state }) => {
    logger.debug(`Got analytics instance ${ input.id } in the global scope.`);
    return { id: analyticsManifest._id, specification: analyticsManifest, state };
  }).catch((error) => {
    logger.error(`Failed to get analytics instance ${ input.id } in the global scope.`, error);
    throw error;
  });
};

// Gets a locally scoped analytics instance.
const _getLocalAnalyticsInstance = (input) => {
  logger.debug(`Get analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
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
      uri: `${ edgeGateway.edgeAnalyticsEngineBaseURL }/analytics-instances/${ input.id }`,
      json: true
    });
  }).then((response) => {
    // Fill in the edge gateway.
    return { ...response, edgeGatewayReferenceID: input.edgeGatewayReferenceID };
  }).then((analyticsInstance) => {
    logger.debug(`Got analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
    return analyticsInstance;
  }).catch((error) => {
    logger.error(`Failed to get analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`,
      error);
    throw error;
  });
};

// Gets an analytics instance.
const getAnalyticsInstance = (input) => {
  logger.debug(`Get analytics instance ${ input.id }.`);
  return Promise.try(() => {
    return input.edgeGatewayReferenceID ? _getLocalAnalyticsInstance(input) :
      _getGlobalAnalyticsInstance(input);
  }).then((analyticsInstance) => {
    logger.debug(`Got analytics instance ${ input.id }.`);
    return analyticsInstance;
  }).catch((error) => {
    logger.error(`Failed to get analytics instance ${ input.id }.`, error);
    throw error;
  });
};

module.exports = getAnalyticsInstance;
