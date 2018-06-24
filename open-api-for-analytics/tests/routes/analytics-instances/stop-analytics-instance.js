const faker = require('faker');
const nock = require('nock');
const Promise = require('bluebird');
const sinon = require('sinon');

const AIM = require('../../../core/workers/analytics-instance-manager');
const analyticsInstanceHelper = require('../../helpers/analytics-instances');
const app = require('../../../server');
const edgeGatewayHelper = require('../../helpers/edge-gateways');
const requests = require('../../requests');
const State = require('../../../core/models/state');

// Tests the analytics instance stop.
const testStopAnalyticsInstance = () => {
  describe('POST @ /analytics-instance/:id/stop', () => {
    before(() => {
      return Promise.try(() => {
        const stub = sinon.stub(AIM, 'stopAnalyticsInstance');
        stub.returns(Promise.resolve(State.STOPPED));
        return null;
      });
    });
    after(() => {
      return Promise.try(() => {
        AIM.stopAnalyticsInstance.restore();
        return null;
      });
    });
    it('should stop a locally scoped analytics instance', () => {
      const edgeAnalyticsEngineBaseUrl = faker.internet.url();
      const analyticsManifestId = faker.random.uuid();
      nock(`${ edgeAnalyticsEngineBaseUrl }`).post(`/analytics-instances/${ analyticsManifestId }/stop`).reply(204);
      const p = Promise.try(() => {
        return edgeGatewayHelper.createEdgeGateway({
          edgeAnalyticsEngineBaseURL: edgeAnalyticsEngineBaseUrl
        });
      }).then((edgeGateway) => {
        return requests.cpost(app, `/api/analytics-instances/${ analyticsManifestId }/stop?edgeGatewayReferenceID=${ edgeGateway._id }`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 204)
      ]);
    });

    it('should stop a globally scoped analytics instance', () => {
      const p = Promise.try(() => {
        return analyticsInstanceHelper.createAnalyticsInstance();
      }).then((analyticsManifest) => {
        return requests.cpost(app, `/api/analytics-instances/${ analyticsManifest._id }/stop`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 204)
      ]);
    });
  });
};

module.exports = testStopAnalyticsInstance;
