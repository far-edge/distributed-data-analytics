const discoverDataSources = require('./discover-data-sources');
const getDataFromDataSource = require('./get-data-from-data-source');
const registerDataSource = require('./register-data-source');
const unregisterDataSource = require('./unregister-data-source');

module.exports = {
  discoverDataSources,
  getDataFromDataSource,
  registerDataSource,
  unregisterDataSource
};
