const Promise = require('bluebird');
const request = require('request-promise');

const logger = require('../common/loggers').get('DATA-SOURCE-DISCOVERY');

// Discovers data sources.
const discoverDataSources = (criteria) => {
  logger.debug('Discover data sources.');
  return Promise.try(() => {
    return request({
      uri: `${ process.env.DATA_ROUTER_AND_PREPROCESSOR_BASE_URL }/data-sources/discover`,
      method: 'POST',
      body: criteria,
      json: true
    });
  }).then((response) => {
    logger.debug('Discovered data sources.');
    return response.dataSources;
  }).catch((error) => {
    logger.error('Failed to discover data sources.', error);
    throw error;
  });
};

module.exports = {
  discoverDataSources
};
