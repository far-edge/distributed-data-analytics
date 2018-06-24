const testCreateEdgeGateway = require('./create-edge-gateway');
const testDeleteEdgeGateway = require('./delete-edge-gateway');
const testDiscoverEdgeGateways = require('./discover-edge-gateways');
const testGetEdgeGateway = require('./get-edge-gateway');
const testUpdateEdgeGateway = require('./update-edge-gateway');

describe('Edge gateways', () => {
  // Test the edge gateway creation.
  testCreateEdgeGateway();

  // Test the edge gateway deletion.
  testDeleteEdgeGateway();

  // Test the edge gateway discovery.
  testDiscoverEdgeGateways();

  // Test the edge gateway retrieval.
  testGetEdgeGateway();

  // Test the edge gateway update.
  testUpdateEdgeGateway();
});
