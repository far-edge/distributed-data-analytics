const Promise = require('bluebird');

const AIM = require('../../workers/analytics-instance-manager');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');

// Stops an analytics instance.
const stopAnalyticsInstance = (input) => {
  logger.debug(`Stop analytics instance ${ input.id }.`);
  return Promise.try(() => {
    // Stop the analytics instance with the given ID.
    return AIM.stopAnalyticsInstance(input.id);
  }).then(() => {
    logger.debug(`Stopped analytics instance ${ input.id }.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to stop analytics instance ${ input.id }.`, error);
    throw error;
  });
};

module.exports = stopAnalyticsInstance;
