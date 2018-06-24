const Promise = require('bluebird');

const EdgeGateway = require('../../models/edge-gateway');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('EDGE-GATEWAYS');

// Gets an edge gateway.
const getEdgeGateway = (input) => {
  logger.debug(`Get edge gateway ${ input.id }.`);
  return Promise.try(() => {
    // Find the edge gateway with the given ID.
    return EdgeGateway.findById(input.id);
  }).then((edgeGateway) => {
    // The edge gateway does not exist.
    if (!edgeGateway) {
      logger.error(`Edge gateway ${ input.id } does not exist.`);
      throw new errors.NotFoundError('EDGE_GATEWAY_NOT_FOUND');
    }
    logger.debug(`Got edge gateway ${ input.id }.`);
    return edgeGateway;
  }).catch((error) => {
    logger.error(`Failed to get edge gateway ${ input.id }.`, error);
    throw error;
  });
};

module.exports = getEdgeGateway;
