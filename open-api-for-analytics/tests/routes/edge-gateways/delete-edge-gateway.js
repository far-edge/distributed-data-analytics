const Promise = require('bluebird');

const app = require('../../../server');
const edgeGatewayHelper = require('../../helpers/edge-gateways');
const requests = require('../../requests');

// Tests the edge gateway deletion.
const testDeleteEdgeGateway = () => {
  describe('DELETE @ /edge-gateways/:id', () => {
    it('should delete an edge gateway', () => {
      const p = Promise.try(() => {
        return edgeGatewayHelper.createEdgeGateway();
      }).then((edgeGateway) => {
        return requests.cdelete(app, `/api/edge-gateways/${ edgeGateway._id }`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 204)
      ]);
    });
  });
};

module.exports = testDeleteEdgeGateway;
