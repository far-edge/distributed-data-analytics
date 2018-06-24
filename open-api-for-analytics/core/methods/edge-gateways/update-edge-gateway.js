const Promise = require('bluebird');

const common = require('./common');
const EdgeGateway = require('../../models/edge-gateway');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('EDGE-GATEWAYS');

// Updates an edge gateway.
const updateEdgeGateway = (input) => {
  logger.debug(`Update edge gateway ${ input.id }.`);
  return Promise.try(() => {
    // Find the edge gateway with the given ID.
    return EdgeGateway.findById(input.id);
  }).then((edgeGateway) => {
    // The edge gateway does not exist.
    if (!edgeGateway) {
      logger.error(`Edge gateway ${ input.id } does not exist.`);
      throw new errors.NotFoundError('EDGE_GATEWAY_NOT_FOUND');
    }
    // Change the edge gateway.
    edgeGateway.name = input.name;
    edgeGateway.description = input.description;
    edgeGateway.namespace = input.namespace;
    edgeGateway.macAddress = input.macAddress;
    edgeGateway.location = input.location;
    edgeGateway.dataRouterAndPreprocessorBaseURL = input.dataRouterAndPreprocessorBaseURL;
    edgeGateway.edgeAnalyticsEngineBaseURL = input.edgeAnalyticsEngineBaseURL;
    edgeGateway.additionalInformation = input.additionalInformation;
    // Validate the edge gateway.
    return common.validateEdgeGateway(edgeGateway);
  }).then((edgeGateway) => {
    // Save the edge gateway.
    return edgeGateway.save();
  }).then((edgeGateway) => {
    logger.debug(`Updated edge gateway ${ input.id }.`);
    return edgeGateway;
  }).catch((error) => {
    logger.error(`Failed to update edge gateway ${ input.id }.`, error);
    throw error;
  });
};

module.exports = updateEdgeGateway;
