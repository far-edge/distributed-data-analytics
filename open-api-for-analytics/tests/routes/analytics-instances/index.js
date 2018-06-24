const testCreateAnalyticsInstance = require('./create-analytics-instance');
const testDestroyAnalyticsInstance = require('./destroy-analytics-instance');
const testDiscoverAnalyticsInstances = require('./discover-analytics-instances');
const testGetAnalyticsInstance = require('./get-analytics-instance');
const testGetAnalyticsInstanceSpecification = require('./get-analytics-instance-specification');
const testGetAnalyticsInstanceState = require('./get-analytics-instance-state');
const testStartAnalyticsInstance = require('./start-analytics-instance');
const testStopAnalyticsInstance = require('./stop-analytics-instance');
const testUpdateAnalyticsInstanceSpecification =
  require('./update-analytics-instance-specification');

describe('Analytics instances', () => {
  // Test the analytics instance creation.
  testCreateAnalyticsInstance();

  // Test the analytics instance destruction.
  testDestroyAnalyticsInstance();

  // Test the analytics instance discovery.
  testDiscoverAnalyticsInstances();

  // Test the analytics instance retrieval.
  testGetAnalyticsInstance();

  // Test the analytics instance specification retrieval.
  testGetAnalyticsInstanceSpecification();

  // Test the analytics instance state retrieval.
  testGetAnalyticsInstanceState();

  // Test the analytics instance start.
  testStartAnalyticsInstance();

  // Test the analytics instance stop.
  testStopAnalyticsInstance();

  // Test the analytics instance specification update.
  testUpdateAnalyticsInstanceSpecification();
});
