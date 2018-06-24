const faker = require('faker');
const nock = require('nock');
const Promise = require('bluebird');

const analyticsInstanceHelper = require('../../helpers/analytics-instances');
const app = require('../../../server');
const edgeGatewayHelper = require('../../helpers/edge-gateways');
const requests = require('../../requests');

// Tests the analytics instance specification retrieval.
const testGetAnalyticsInstanceSpecification = () => {
  describe('GET @ /analytics-instance/:id/specification', () => {
    it('should get the specification of a locally scoped analytics instance', () => {
      const edgeAnalyticsEngineBaseUrl = faker.internet.url();
      const analyticsManifestId = faker.random.uuid();
      nock(`${ edgeAnalyticsEngineBaseUrl }`).get(`/analytics-instances/${ analyticsManifestId }/specification`).reply(200, {
      });
      const p = Promise.try(() => {
        return edgeGatewayHelper.createEdgeGateway({
          edgeAnalyticsEngineBaseURL: edgeAnalyticsEngineBaseUrl
        });
      }).then((edgeGateway) => {
        return requests.cget(app, `/api/analytics-instances/${ analyticsManifestId }/specification?edgeGatewayReferenceID=${ edgeGateway._id }`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 200),
        p.should.eventually.have.property('body').that.is.an('object')
      ]);
    });

    it('should get the specification of a globally scoped analytics instance', () => {
      const p = Promise.try(() => {
        return analyticsInstanceHelper.createAnalyticsInstance({});
      }).then((analyticsInstance) => {
        return requests.cget(app, `/api/analytics-instances/${ analyticsInstance._id }/specification`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 200),
        p.should.eventually.have.property('body').that.is.an('object')
      ]);
    });
  });
};

module.exports = testGetAnalyticsInstanceSpecification;
