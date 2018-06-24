const Promise = require('bluebird');

const EdgeGateway = require('../../models/edge-gateway');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('EDGE-GATEWAYS');

// Validates an edge gateway.
const validateEdgeGateway = (edgeGateway) => {
  return Promise.try(() => {
    // The name must be unique among all edge gateways.
    return EdgeGateway.count({
      _id: {
        $ne: edgeGateway._id
      },
      name: edgeGateway.name
    }).then((exists) => {
      if (exists) {
        logger.error(`Name ${ edgeGateway.name } is taken.`);
        throw new errors.BadRequestError('NAME_TAKEN');
      }
      return null;
    });
  }).then(() => {
    // The namespace must be unique among all edge gateways.
    return EdgeGateway.count({
      _id: {
        $ne: edgeGateway._id
      },
      namespace: edgeGateway.namespace
    }).then((exists) => {
      if (exists) {
        logger.error(`Namespace ${ edgeGateway.namespace } is taken.`);
        throw new errors.BadRequestError('NAMESPACE_TAKEN');
      }
      return null;
    });
  }).then(() => {
    return edgeGateway;
  });
};

module.exports = {
  validateEdgeGateway
};
