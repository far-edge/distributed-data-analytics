const faker = require('faker');
const nock = require('nock');
const Promise = require('bluebird');

const app = require('../../../server');
const edgeGatewayHelper = require('../../helpers/edge-gateways');
const requests = require('../../requests');

// Tests the analytics instance discovery.
const testDiscoverAnalyticsInstances = () => {
  describe('POST @ /analytics-instances/discover', () => {
    it('should discover locally scoped analytics instances', () => {
      const edgeAnalyticsEngineBaseUrl = faker.internet.url();
      nock(`${ edgeAnalyticsEngineBaseUrl }`).post('/analytics-instances/discover', {
      }).reply(200, {
        analyticsInstances: [{ }]
      });
      const p = Promise.try(() => {
        return edgeGatewayHelper.createEdgeGateway({
          edgeAnalyticsEngineBaseURL: edgeAnalyticsEngineBaseUrl
        });
      }).then((edgeGateway) => {
        const data = {
        };
        return requests.cpost(app, `/api/analytics-instances/discover?edgeGatewayReferenceID=${ edgeGateway._id }`,
          data);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 200),
        p.should.eventually.have.property('body').that.has.property(
          'analyticsInstances'
        ).with.length(1)
      ]);
    });
  });
};

module.exports = testDiscoverAnalyticsInstances;
