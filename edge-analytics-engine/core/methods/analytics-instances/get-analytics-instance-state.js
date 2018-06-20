const Promise = require('bluebird');

const AIM = require('../../workers/analytics-instance-manager');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');

// Gets the state of an analytics instance.
const getAnalyticsInstanceState = (input) => {
  logger.debug(`Get state of analytics instance ${ input.id }.`);
  return Promise.try(() => {
    // Get the state of the analytics instance with the given ID.
    return AIM.getAnalyticsInstanceState(input.id);
  }).then((state) => {
    logger.debug(`Got state of analytics instance ${ input.id }.`);
    return { id: input.id, state };
  }).catch((error) => {
    logger.error(`Failed to get state of analytics instance ${ input.id }.`, error);
    throw error;
  });
};

module.exports = getAnalyticsInstanceState;
