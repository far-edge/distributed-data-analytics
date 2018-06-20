const Promise = require('bluebird');
const request = require('request-promise');

const logger = require('../common/loggers').get('MODEL-DISCOVERY');

// Discovers analytics processor definitions.
const discoverAnalyticsProcessorDefinitions = (criteria) => {
  logger.debug('Discover analytics processor definitions.');
  return Promise.try(() => {
    return request({
      uri: `${ process.env.MODEL_REPOSITORY_BASE_URL }/analytics-processor-definitions/discover`,
      method: 'POST',
      body: criteria,
      json: true
    });
  }).then((response) => {
    logger.debug('Discovered analytics processor definitions.');
    return response.analyticsProcessorDefinitions;
  }).catch((error) => {
    logger.error('Failed to discover analytics processor definitions.', error);
    throw error;
  });
};

module.exports = {
  discoverAnalyticsProcessorDefinitions
};
