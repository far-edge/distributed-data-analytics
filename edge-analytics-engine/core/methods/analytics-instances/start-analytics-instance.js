const Promise = require('bluebird');

const AIM = require('../../workers/analytics-instance-manager');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');

// Starts an analytics instance.
const startAnalyticsInstance = (input) => {
  logger.debug(`Start analytics instance ${ input.id }.`);
  return Promise.try(() => {
    // Start the analytics instance with the given ID.
    return AIM.startAnalyticsInstance(input.id);
  }).then(() => {
    logger.debug(`Started analytics instance ${ input.id }.`);
    return null;
  }).catch((error) => {
    logger.error(`Failed to start analytics instance ${ input.id }.`, error);
    throw error;
  });
};

module.exports = startAnalyticsInstance;
