const testDiscoverDataSources = require('./discover-data-sources');
const testRegisterDataSource = require('./register-data-source');
const testUnregisterDataSource = require('./unregister-data-source');

describe('Data sources', () => {
  // Test the data source discovery.
  testDiscoverDataSources();

  // Test the data source registration.
  testRegisterDataSource();

  // Test the data source unregistration.
  testUnregisterDataSource();
});
