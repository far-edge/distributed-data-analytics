const Promise = require('bluebird');

const EdgeGateway = require('../../models/edge-gateway');
const logger = require('../../common/loggers').get('EDGE-GATEWAYS');

// Discovers edge gateways.
const discoverEdgeGateways = (input) => {
  logger.debug('Discover edge gateways.');
  return Promise.try(() => {
    // Find the edge gateways that match the given criteria.
    return EdgeGateway.find({
      ...(input.id ? { _id: input.id } : { }),
      ...(input.name ? { name: input.name } : { }),
      ...(input.namespace ? { namespace: input.namespace } : { }),
      ...(input.macAddress ? { macAddress: input.macAddress } : { })
    });
  }).then((edgeGateways) => {
    logger.debug('Discovered edge gateways.');
    return { edgeGateways };
  }).catch((error) => {
    logger.error('Failed to discover edge gateways.', error);
    throw error;
  });
};

module.exports = discoverEdgeGateways;
