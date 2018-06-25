const Promise = require('bluebird');
const request = require('request-promise');
const rerrors = require('request-promise/errors');

const AIM = require('../../workers/analytics-instance-manager');
const EdgeGateway = require('../../models/edge-gateway');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');

// Gets a globally scoped analytics instance.
const _getGlobalAnalyticsInstanceState = (input) => {
  logger.debug(`Get state of analytics instance ${ input.id } in the global scope.`);
  return Promise.try(() => {
    // Get the state of the analytics instance with the given ID.
    return AIM.getAnalyticsInstanceState(input.id);
  }).then((state) => {
    logger.debug(`Got state of analytics instance ${ input.id } in the global scope.`);
    return { id: input.id, state };
  }).catch((error) => {
    logger.error(`Failed to get state of analytics instance ${ input.id } in the global scope.`, error);
    throw error;
  });
};

// Gets a locally scoped analytics instance.
const _getLocalAnalyticsInstanceState = (input) => {
  logger.debug(`Get state of analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
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
      uri: `${ edgeGateway.edgeAnalyticsEngineBaseURL }/analytics-instances/${ input.id }/state`,
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
  }).then((analyticsInstance) => {
    logger.debug(`Got state of analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
    return analyticsInstance;
  }).catch((error) => {
    logger.error(`Failed to get state of analytics instance ${ input.id } in edge gateway ${ input.edgeGatewayReferenceID } local scope.`,
      error);
    throw error;
  });
};

// Gets the state of an analytics instance.
const getAnalyticsInstanceState = (input) => {
  logger.debug(`Get state of analytics instance ${ input.id }.`);
  return Promise.try(() => {
    return input.edgeGatewayReferenceID ? _getLocalAnalyticsInstanceState(input) :
      _getGlobalAnalyticsInstanceState(input);
  }).then((analyticsInstance) => {
    logger.debug(`Got state of analytics instance ${ input.id }.`);
    return analyticsInstance;
  }).catch((error) => {
    logger.error(`Failed to get state of analytics instance ${ input.id }.`, error);
    throw error;
  });
};

module.exports = getAnalyticsInstanceState;
