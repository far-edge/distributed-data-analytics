const faker = require('faker');
const nock = require('nock');
const Promise = require('bluebird');
const sinon = require('sinon');

const AIM = require('../../../core/workers/analytics-instance-manager');
const analyticsInstanceHelper = require('../../helpers/analytics-instances');
const app = require('../../../server');
const edgeGatewayHelper = require('../../helpers/edge-gateways');
const requests = require('../../requests');

// Tests the analytics instance destruction.
const testDestroyAnalyticsInstance = () => {
  describe('DELETE @ /analytics-instances/:id', () => {
    before(() => {
      return Promise.try(() => {
        const stub = sinon.stub(AIM, 'destroyAnalyticsInstance');
        stub.returns(Promise.resolve(null));
        return null;
      });
    });
    after(() => {
      return Promise.try(() => {
        AIM.destroyAnalyticsInstance.restore();
        return null;
      });
    });
    it('should destroy a locally scoped analytics instance', () => {
      const edgeAnalyticsEngineBaseUrl = faker.internet.url();
      const analyticsManifestId = faker.random.uuid();
      nock(`${ edgeAnalyticsEngineBaseUrl }`).delete(`/analytics-instances/${ analyticsManifestId }`).reply(204);
      const p = Promise.try(() => {
        return edgeGatewayHelper.createEdgeGateway({
          edgeAnalyticsEngineBaseURL: edgeAnalyticsEngineBaseUrl
        });
      }).then((edgeGateway) => {
        return requests.cdelete(app, `/api/analytics-instances/${ analyticsManifestId }?edgeGatewayReferenceID=${ edgeGateway._id }`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 204)
      ]);
    });

    it('should destroy a globally scoped analytics instance', () => {
      const p = Promise.try(() => {
        return analyticsInstanceHelper.createAnalyticsInstance();
      }).then((analyticsManifest) => {
        return requests.cdelete(app, `/api/analytics-instances/${ analyticsManifest._id }`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 204)
      ]);
    });
  });
};

module.exports = testDestroyAnalyticsInstance;
