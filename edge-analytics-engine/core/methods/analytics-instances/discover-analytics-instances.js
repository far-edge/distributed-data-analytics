const Promise = require('bluebird');

const AIM = require('../../workers/analytics-instance-manager');
const AnalyticsManifest = require('../../models/analytics-manifest');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');

// Discovers analytics instances.
const discoverAnalyticsInstances = (input) => {
  logger.debug('Discover analytics instances.');
  return Promise.try(() => {
    // Find the analytics manifests that match the given criteria.
    return AnalyticsManifest.find({
      ...(input.id ? { _id: input.id } : { }),
    });
  }).then((analyticsManifests) => {
    // Get the state for each one of them.
    return Promise.map(analyticsManifests, (analyticsManifest) => {
      return AIM.getAnalyticsInstanceState(analyticsManifest._id).then((state) => {
        return { id: analyticsManifest._id, specification: analyticsManifest, state };
      });
    });
  }).then((analyticsInstances) => {
    logger.debug('Discovered analytics instances.');
    return { analyticsInstances };
  }).catch((error) => {
    logger.error('Failed to discover analytics instances.', error);
    throw error;
  });
};

module.exports = discoverAnalyticsInstances;
