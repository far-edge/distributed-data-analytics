const Promise = require('bluebird');
const request = require('request-promise');
const rerrors = require('request-promise/errors');

const AIM = require('../../workers/analytics-instance-manager');
const AnalyticsManifest = require('../../models/analytics-manifest');
const common = require('./common');
const EdgeGateway = require('../../models/edge-gateway');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');
const State = require('../../models/state');

// Updates the specification of a globally scoped analytics instance.
const _updateGlobalAnalyticsInstanceSpecification = (input) => {
  logger.debug(`Update specification of analytics instance ${ input.id } in the global scope.`);
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
    return AIM.getAnalyticsInstanceState(input.id).then((state) => {
      // The analytics instance is running.
      if (state === State.RUNNING) {
        logger.error(`Analytics instance ${ input.id } is running.`);
        throw new errors.BadRequestError('ANALYTICS_INSTANCE_RUNNING');
      }
      return analyticsManifest;
    });
  }).then((analyticsManifest) => {
    // Change the analytics manifest.
    analyticsManifest.name = input.name;
    analyticsManifest.description = input.description;
    analyticsManifest.analyticsProcessors = input.analyticsProcessors;
    // Validate the analytics manifest.
    return common.validateAnalyticsManifest(analyticsManifest);
  }).then((analyticsManifest) => {
    // Save the analytics manifest.
    return analyticsManifest.save();
  }).then((analyticsManifest) => {
    logger.debug(`Updated specification of analytics instance ${ input.id } in the global scope.`);
    return analyticsManifest;
  }).catch((error) => {
    logger.error(`Failed to update specification of analytics instance ${ input.id } in the global scope.`, error);
    throw error;
  });
};

// Updates the specification of a locally scoped analytics instance.
const _updateLocalAnalyticsInstanceSpecification = (input) => {
  logger.debug(`Update specification of analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
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
      method: 'PUT',
      uri: `${ edgeGateway.edgeAnalyticsEngineBaseURL }/analytics-instances/${ input.id }/specification`,
      body: input,
      json: true,
      resolveWithFullResponse: true,
      simple: true
    }).catch(rerrors.StatusCodeError, (reason) => {
      if (reason.statusCode === 400) {
        throw new errors.BadRequestError(reason.response.body.error);
      }
      if (reason.statusCode === 404) {
        throw new errors.NotFoundError(reason.response.body.error);
      }
      throw new Error(reason.response.body.error);
    });
  }).then((response) => {
    // Fill in the edge gateway.
    return { ...response.body, edgeGatewayReferenceID: input.edgeGatewayReferenceID };
  }).then((analyticsManifest) => {
    logger.debug(`Updated analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
    return analyticsManifest;
  }).catch((error) => {
    logger.error(`Failed to update analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`,
      error);
    throw error;
  });
};

// Updates the specification of an analytics instance.
const updateAnalyticsInstanceSpecification = (input) => {
  return Promise.try(() => {
    logger.debug(`Update specification of analytics instance ${ input.id }.`);
    return input.edgeGatewayReferenceID ? _updateLocalAnalyticsInstanceSpecification(input) :
      _updateGlobalAnalyticsInstanceSpecification(input);
  }).then((analyticsManifest) => {
    logger.debug(`Updated specification of analytics instance ${ input.id }.`);
    return analyticsManifest;
  }).catch((error) => {
    logger.error(`Failed to update analytics instance ${ input.id }.`, error);
    throw error;
  });
};

module.exports = updateAnalyticsInstanceSpecification;
