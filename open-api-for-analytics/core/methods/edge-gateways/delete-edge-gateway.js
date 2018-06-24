const Promise = require('bluebird');

const EdgeGateway = require('../../models/edge-gateway');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('EDGE-GATEWAYS');

// Deletes an edge gateway.
const deleteEdgeGateway = (input) => {
  logger.debug(`Delete edge gateway ${ input.id }.`);
  return Promise.try(() => {
    // Find the edge gateway with the given ID.
    return EdgeGateway.findById(input.id);
  }).then((edgeGateway) => {
    // The edge gateway does not exist.
    if (!edgeGateway) {
      logger.error(`Edge gateway ${ input.id } does not exist.`);
      throw new errors.NotFoundError('EDGE_GATEWAY_NOT_FOUND');
    }
    // Delete the edge gateway.
    return edgeGateway.remove();
  }).then(() => {
    logger.debug(`Deleted edge gateway ${ input.id }.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to delete edge gateway ${ input.id }.`, error);
    throw error;
  });
};

module.exports = deleteEdgeGateway;
