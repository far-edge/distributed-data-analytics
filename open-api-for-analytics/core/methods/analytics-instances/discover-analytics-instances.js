const Promise = require('bluebird');
const request = require('request-promise');

const AIM = require('../../workers/analytics-instance-manager');
const AnalyticsManifest = require('../../models/analytics-manifest');
const EdgeGateway = require('../../models/edge-gateway');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');

// Discovers globally scoped analytics instances.
const _discoverGlobalAnalyticsInstances = (input) => {
  logger.debug('Discover analytics instances in the global scope.');
  return Promise.try(() => {
    if (input.edgeGatewayReferenceID) {
      return [];
    }
    // Find the analytics manifests that match the given criteria.
    return AnalyticsManifest.find({
      ...(input.id ? { _id: input.id } : { }),
      ...(input.name ? { name: input.name } : { })
    });
  }).then((analyticsManifests) => {
    // Get the state for each one of them.
    return Promise.map(analyticsManifests, (analyticsManifest) => {
      return AIM.getAnalyticsInstanceState(analyticsManifest._id).then((state) => {
        return { id: analyticsManifest._id, specification: analyticsManifest, state };
      });
    });
  }).then((analyticsInstances) => {
    logger.debug('Discovered analytics instances in the global scope.');
    return analyticsInstances;
  }).catch((error) => {
    logger.error('Failed to discover analytics instances in the global scope.', error);
    throw error;
  });
};

// Discovers locally scoped analytics instances.
const _discoverLocalAnalyticsInstances = (input) => {
  logger.debug(`Discover analytics instances in edge gateway ${ input.edgeGatewayReferenceID } local scope.`);
  return Promise.try(() => {
    // Find either all edge gateways or a specific one.
    return EdgeGateway.find({
      ...(input.edgeGatewayReferenceID ? { _id: input.edgeGatewayReferenceID } : { })
    });
  }).then((edgeGateways) => {
    // The specific edge gateway (if any) does not exist.
    if (input.edgeGatewayReferenceID && !edgeGateways.length) {
      logger.error(`Edge gateway ${ input.id } does not exist.`);
      throw new errors.BadRequestError('EDGE_GATEWAY_NOT_FOUND');
    }
    // Forward the request to all edge gateways.
    return Promise.map(edgeGateways, (edgeGateway) => {
      logger.debug(`Discover analytics instances in edge gateway ${ edgeGateway._id } local scope.`);
      return request({
        method: 'POST',
        uri: `${ edgeGateway.edgeAnalyticsEngineBaseURL }/analytics-instances/discover`,
        body: {
          ...(input.id ? { _id: input.id } : { }),
          ...(input.name ? { name: input.name } : { })
        },
        json: true
      }).then((response) => {
        // Fill in the edge gateway.
        return response.analyticsInstances.map((analyticsInstance) => {
          return { ...analyticsInstance, edgeGatewayReferenceID: edgeGateway._id };
        });
      }).then((analyticsInstances) => {
        logger.debug(`Discovered analytics instances in edge gateway ${ edgeGateway._id } local scope.`);
        return analyticsInstances;
      }).catch((error) => {
        logger.error('Failed to discover analytics instances in edge gateway ${ edgeGateway._id } local scope.', error);
        return [];
      });
    });
  }).then((analyticsInstances) => {
    return analyticsInstances.reduce((acc, ams) => { return acc.concat(ams); }, []);
  }).catch((error) => {
    logger.error(`Failed to discover analytics instances in edge gateway ${ input.edgeGatewayReferenceID } local scope.`,
      error);
    throw error;
  });
};

// Discovers analytics instances.
const discoverAnalyticsInstances = (input) => {
  logger.debug('Discover analytics instances.');
  return Promise.all([
    // Discover the locally scoped analytics instances that match the given criteria.
    _discoverLocalAnalyticsInstances(input),
    // Discover the globally scoped analytics instances that match the given criteria.
    _discoverGlobalAnalyticsInstances(input)
  ]).spread((local, global) => {
    return local.concat(global);
  }).then((analyticsInstances) => {
    logger.debug('Discovered analytics instances.');
    return { analyticsInstances };
  }).catch((error) => {
    logger.error('Failed to discover analytics instances.', error);
    throw error;
  });
};

module.exports = discoverAnalyticsInstances;
