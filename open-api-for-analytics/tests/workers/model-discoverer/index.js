const testDiscoverAnalyticsProcessorDefinitions = require('./discover-analytics-processor-definitions');
const testDiscoverDataSourceDefinitions = require('./discover-data-source-definitions');

describe('Model discoverer', () => {
  // Test the analytics processor definition discovery.
  testDiscoverAnalyticsProcessorDefinitions();

  // Test the data source definition discovery.
  testDiscoverDataSourceDefinitions();
});
