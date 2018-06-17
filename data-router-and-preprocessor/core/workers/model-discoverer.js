const Promise = require('bluebird');
const request = require('request-promise');

const logger = require('../common/loggers').get('MODEL-DISCOVERY');

// Discovers data source definitions.
const discoverDataSourceDefinitions = (criteria) => {
  logger.debug('Discover data source definitions.');
  return Promise.try(() => {
    return request({
      uri: `${ process.env.MODEL_REPOSITORY_BASE_URL }/data-source-definitions/discover`,
      method: 'POST',
      body: criteria,
      json: true
    });
  }).then((response) => {
    logger.debug('Discovered data source definitions.');
    return response.dataSourceDefinitions;
  }).catch((error) => {
    logger.error('Failed to discover data source definitions.', error);
    throw error;
  });
};

// Discovers data interfaces.
const discoverDataInterfaces = (criteria) => {
  logger.debug('Discover data interfaces.');
  return Promise.try(() => {
    return request({
      uri: `${ process.env.MODEL_REPOSITORY_BASE_URL }/data-interfaces/discover`,
      method: 'POST',
      body: criteria,
      json: true
    });
  }).then((response) => {
    logger.debug('Discovered data interfaces.');
    return response.dataInterfaces;
  }).catch((error) => {
    logger.error('Failed to discover data interfaces.', error);
    throw error;
  });
};

// Discovers data kinds.
const discoverDataKinds = (criteria) => {
  logger.debug('Discover data kinds.');
  return Promise.try(() => {
    return request({
      uri: `${ process.env.MODEL_REPOSITORY_BASE_URL }/data-kinds/discover`,
      method: 'POST',
      body: criteria,
      json: true
    });
  }).then((response) => {
    logger.debug('Discovered data kinds.');
    return response.dataKinds;
  }).catch((error) => {
    logger.error('Failed to discover data kinds.', error);
    throw error;
  });
};

module.exports = {
  discoverDataSourceDefinitions,
  discoverDataInterfaces,
  discoverDataKinds
};
