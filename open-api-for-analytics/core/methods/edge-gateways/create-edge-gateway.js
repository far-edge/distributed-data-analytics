const Promise = require('bluebird');

const EdgeGateway = require('../../models/edge-gateway');
const common = require('./common');
const logger = require('../../common/loggers').get('EDGE-GATEWAYS');

// Creates an edge gateway.
const createEdgeGateway = (input) => {
  logger.debug('Create an edge gateway.');
  return Promise.try(() => {
    // Create the edge gateway.
    const edgeGateway = new EdgeGateway(input);
    // Validate the data kind.
    return common.validateEdgeGateway(edgeGateway);
  }).then((edgeGateway) => {
    // Save the edge gateway.
    return edgeGateway.save();
  }).then((edgeGateway) => {
    logger.debug(`Created edge gateway ${ edgeGateway._id }.`);
    return edgeGateway;
  }).catch((error) => {
    logger.error('Failed to create an edge gateway.', error);
    throw error;
  });
};

module.exports = createEdgeGateway;
