const faker = require('faker');
const Promise = require('bluebird');

const app = require('../../../server');
const edgeGatewayHelper = require('../../helpers/edge-gateways');
const requests = require('../../requests');

// Tests the edge gateway update.
const testUpdateEdgeGateway = () => {
  describe('PUT @ /edge-gateways/:id', () => {
    it('should update an edge gateway', () => {
      const p = Promise.try(() => {
        return edgeGatewayHelper.createEdgeGateway();
      }).then((edgeGateway) => {
        const data = { ...edgeGateway, name: faker.random.words(2) };
        return requests.cput(app, `/api/edge-gateways/${ edgeGateway._id }`, data);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 200),
        p.should.eventually.have.property('body').that.is.an('object')
      ]);
    });
  });
};

module.exports = testUpdateEdgeGateway;
