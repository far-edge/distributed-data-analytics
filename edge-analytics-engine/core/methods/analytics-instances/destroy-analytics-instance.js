const Promise = require('bluebird');

const AIM = require('../../workers/analytics-instance-manager');
const AnalyticsManifest = require('../../models/analytics-manifest');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');

// Destroys an analytics instance.
const destroyAnalyticsInstance = (input) => {
  logger.debug(`Destroy analytics instance ${ input.id }.`);
  return Promise.try(() => {
    // Find the analytics manifest with the given ID.
    return AnalyticsManifest.findById(input.id);
  }).then((analyticsManifest) => {
    // The analytics manifest does not exist.
    if (!analyticsManifest) {
      logger.error(`Analytics instance ${ input.id } does not exist.`);
      throw new errors.NotFoundError('ANALYTICS_INSTANCE_NOT_FOUND');
    }
    // Destroy the analytics instance.
    return AIM.destroyAnalyticsInstance(input.id).then(() => {
      return analyticsManifest;
    });
  }).then((analyticsManifest) => {
    // Delete the analytics manifest.
    return analyticsManifest.remove();
  }).then(() => {
    logger.debug(`Destroyed analytics instance ${ input.id }.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to destroy analytics instance ${ input.id }.`, error);
    throw error;
  });
};

module.exports = destroyAnalyticsInstance;
