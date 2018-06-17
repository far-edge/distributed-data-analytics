const testDiscoverDataInterfaces = require('./discover-data-interfaces');
const testDiscoverDataKinds = require('./discover-data-kinds');
const testDiscoverDataSourceDefinitions = require('./discover-data-source-definitions');

describe('Model discoverer', () => {
  // Test the data interface discovery.
  testDiscoverDataInterfaces();

  // Test the data kind discovery.
  testDiscoverDataKinds();

  // Test the data source definition discovery.
  testDiscoverDataSourceDefinitions();
});
