const Promise = require('bluebird');

const AIM = require('../../workers/analytics-instance-manager');
const common = require('./common');
const AnalyticsManifest = require('../../models/analytics-manifest');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');
const State = require('../../models/state');

// Updates the specification of an analytics instance.
const updateAnalyticsInstanceSpecification = (input) => {
  logger.debug(`Update specification of analytics instance ${ input.id }.`);
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
    return AIM.getAnalyticsInstanceState(input.id).then((state) => {
      // The analytics instance is running.
      if (state === State.RUNNING) {
        logger.error(`Analytics instance ${ input.id } is running.`);
        throw new errors.BadRequestError('ANALYTICS_INSTANCE_RUNNING');
      }
      return analyticsManifest;
    });
  }).then((analyticsManifest) => {
    // Change the analytics manifest.
    analyticsManifest.name = input.name;
    analyticsManifest.description = input.description;
    analyticsManifest.analyticsProcessors = input.analyticsProcessors;
    // Validate the analytics manifest.
    return common.validateAnalyticsManifest(analyticsManifest);
  }).then((analyticsManifest) => {
    // Save the analytics manifest.
    return analyticsManifest.save();
  }).then((analyticsManifest) => {
    logger.debug(`Updated specification of analytics instance ${ input.id }.`);
    return analyticsManifest;
  }).catch((error) => {
    logger.error(`Failed to update specification of analytics instance ${ input.id }.`, error);
    throw error;
  });
};

module.exports = updateAnalyticsInstanceSpecification;
