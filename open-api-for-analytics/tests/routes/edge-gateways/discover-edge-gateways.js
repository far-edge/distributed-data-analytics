const Promise = require('bluebird');

const edgeGatewayHelper = require('../../helpers/edge-gateways');
const app = require('../../../server');
const requests = require('../../requests');

// Tests the edge gateway discovery.
const testDiscoverEdgeGateways = () => {
  describe('POST @ /edge-gateways/discover', () => {
    it('should discover edge gateways', () => {
      const p = Promise.try(() => {
        return edgeGatewayHelper.createEdgeGateway({});
      }).then((edgeGateway) => {
        const data = {
          id: edgeGateway._id
        };
        return requests.cpost(app, '/api/edge-gateways/discover', data);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 200),
        p.should.eventually.have.property('body').that.has.property(
          'edgeGateways'
        ).with.length(1)
      ]);
    });
  });
};

module.exports = testDiscoverEdgeGateways;
