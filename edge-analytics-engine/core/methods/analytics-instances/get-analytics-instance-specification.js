const Promise = require('bluebird');

const AnalyticsManifest = require('../../models/analytics-manifest');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');

// Gets the specification of an analytics instance.
const getAnalyticsInstanceSpecification = (input) => {
  logger.debug(`Get specification of analytics instance ${ input.id }.`);
  return Promise.try(() => {
    // Find the analytics manifest with the given ID.
    return AnalyticsManifest.findById(input.id);
  }).then((analyticsManifest) => {
    // The analytics manifest does not exist.
    if (!analyticsManifest) {
      logger.error(`Analytics instance ${ input.id } does not exist.`);
      throw new errors.NotFoundError('ANALYTICS_INSTANCE_NOT_FOUND');
    }
    logger.debug(`Got specification of analytics instance ${ input.id }.`);
    return analyticsManifest;
  }).catch((error) => {
    logger.error(`Failed to get specification of analytics instance ${ input.id }.`, error);
    throw error;
  });
};

module.exports = getAnalyticsInstanceSpecification;
