const Promise = require('bluebird');

const AIM = require('../../workers/analytics-instance-manager');
const AnalyticsManifest = require('../../models/analytics-manifest');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');

// Gets an analytics instance.
const getAnalyticsInstance = (input) => {
  logger.debug(`Get analytics instance ${ input.id }.`);
  return Promise.try(() => {
    // Find the analytics manifest with the given ID.
    return AnalyticsManifest.findById(input.id);
  }).then((analyticsManifest) => {
    // The analytics manifest does not exist.
    if (!analyticsManifest) {
      logger.error(`Analytics instance ${ input.id } does not exist.`);
      throw new errors.NotFoundError('ANALYTICS_INSTANCE_NOT_FOUND');
    }
    // Get the state of the analytics instance.
    return AIM.getAnalyticsInstanceState(analyticsManifest._id).then((state) => {
      return { analyticsManifest, state };
    });
  }).then(({ analyticsManifest, state }) => {
    logger.debug(`Got analytics instance ${ input.id }.`);
    return { id: analyticsManifest._id, specification: analyticsManifest, state };
  }).catch((error) => {
    logger.error(`Failed to get analytics instance ${ input.id }.`, error);
    throw error;
  });
};

module.exports = getAnalyticsInstance;
