const createAnalyticsInstance = require('./create-analytics-instance');
const destroyAnalyticsInstance = require('./destroy-analytics-instance');
const discoverAnalyticsInstances = require('./discover-analytics-instances');
const getAnalyticsInstance = require('./get-analytics-instance');
const getAnalyticsInstanceSpecification = require('./get-analytics-instance-specification');
const getAnalyticsInstanceState = require('./get-analytics-instance-state');
const startAnalyticsInstance = require('./start-analytics-instance');
const stopAnalyticsInstance = require('./stop-analytics-instance');
const updateAnalyticsInstanceSpecification = require('./update-analytics-instance-specification');

module.exports = {
  createAnalyticsInstance,
  destroyAnalyticsInstance,
  discoverAnalyticsInstances,
  getAnalyticsInstance,
  getAnalyticsInstanceSpecification,
  getAnalyticsInstanceState,
  startAnalyticsInstance,
  stopAnalyticsInstance,
  updateAnalyticsInstanceSpecification
};
