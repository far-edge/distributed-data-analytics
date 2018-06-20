const Promise = require('bluebird');

const AIM = require('../../workers/analytics-instance-manager');
const AnalyticsManifest = require('../../models/analytics-manifest');
const common = require('./common');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');

// Creates an analytics instance.
const createAnalyticsInstance = (input) => {
  logger.debug('Create an analytics instance.');
  return Promise.try(() => {
    // Create the analytics manifest.
    const analyticsManifest = new AnalyticsManifest(input);
    // Validate the analytics manifest.
    return common.validateAnalyticsManifest(analyticsManifest);
  }).then((analyticsManifest) => {
    // Save the analytics manifest.
    return analyticsManifest.save();
  }).then((analyticsManifest) => {
    // Create the analyrics instance.
    return AIM.createAnalyticsInstance(analyticsManifest._id).then(() => {
      return analyticsManifest;
    });
  }).then((analyticsManifest) => {
    logger.debug(`Created analytics instance ${ analyticsManifest._id }.`);
    return analyticsManifest;
  }).catch((error) => {
    logger.error('Failed to create an analytics instance.', error);
    throw error;
  });
};

module.exports = createAnalyticsInstance;
