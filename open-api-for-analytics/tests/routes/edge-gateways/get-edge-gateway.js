const Promise = require('bluebird');

const app = require('../../../server');
const edgeGatewayHelper = require('../../helpers/edge-gateways');
const requests = require('../../requests');

// Tests the edge gateway retrieval.
const testGetEdgeGateway = () => {
  describe('GET @ /edge-gateways/:id', () => {
    it('should get an edge gateway', () => {
      const p = Promise.try(() => {
        return edgeGatewayHelper.createEdgeGateway();
      }).then((edgeGateway) => {
        return requests.cget(app, `/api/edge-gateways/${ edgeGateway._id }`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 200),
        p.should.eventually.have.property('body').that.is.an('object')
      ]);
    });
  });
};

module.exports = testGetEdgeGateway;
