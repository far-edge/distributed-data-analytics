const Promise = require('bluebird');
const request = require('request-promise');

const AIM = require('../../workers/analytics-instance-manager');
const AnalyticsManifest = require('../../models/analytics-manifest');
const common = require('./common');
const EdgeGateway = require('../../models/edge-gateway');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');

// Creates a globally scoped analytics instance.
const _createGlobalAnalyticsInstance = (input) => {
  logger.debug('Create an analytics instance in the global scope.');
  return Promise.try(() => {
    // Create the analytics manifest.
    const analyticsManifest = new AnalyticsManifest(input);
    // Validate the analytics manifest.
    return common.validateAnalyticsManifest(analyticsManifest);
  }).then((analyticsManifest) => {
    // Save the analytics manifest.
    return analyticsManifest.save();
  }).then((analyticsManifest) => {
    // Create the analyrics instance.
    return AIM.createAnalyticsInstance(analyticsManifest._id).then(() => {
      return analyticsManifest;
    });
  }).then((analyticsManifest) => {
    logger.debug(`Created analytics instance ${ analyticsManifest._id } in the global scope.`);
    return analyticsManifest;
  }).catch((error) => {
    logger.error('Failed to create an analytics instance in the global scope.', error);
    throw error;
  });
};

// Creates a locally scoped analytics instance.
const _createLocalAnalyticsInstance = (input) => {
  logger.debug(`Create an analytics instance in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
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
      uri: `${ edgeGateway.edgeAnalyticsEngineBaseURL }/analytics-instances`,
      body: input,
      json: true
    });
  }).then((response) => {
    // Fill in the edge gateway.
    return { ...response, edgeGatewayReferenceID: input.edgeGatewayReferenceID };
  }).then((analyticsManifest) => {
    logger.debug(`Created analytics instance ${ analyticsManifest._id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
    return analyticsManifest;
  }).catch((error) => {
    logger.error(`Failed to create an analytics instance in edge gateway ${ input.edgeGatewayReferenceID } local scope.`,
      error);
    throw error;
  });
};

// Creates an analytics instance.
const createAnalyticsInstance = (input) => {
  logger.debug('Create an analytics instance.');
  return Promise.try(() => {
    return input.edgeGatewayReferenceID ? _createLocalAnalyticsInstance(input) :
      _createGlobalAnalyticsInstance(input);
  }).then((analyticsManifest) => {
    logger.debug(`Created analytics instance ${ analyticsManifest._id }.`);
    return analyticsManifest;
  }).catch((error) => {
    logger.error('Failed to create an analytics instance.', error);
    throw error;
  });
};

module.exports = createAnalyticsInstance;
