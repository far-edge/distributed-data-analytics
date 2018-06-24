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

// Tests the analytics instance start.
const testStopAnalyticsInstance = () => {
  describe('POST @ /analytics-instance/:id/start', () => {
    before(() => {
      return Promise.try(() => {
        const stub = sinon.stub(AIM, 'startAnalyticsInstance');
        stub.returns(Promise.resolve(State.RUNNING));
        return null;
      });
    });
    after(() => {
      return Promise.try(() => {
        AIM.startAnalyticsInstance.restore();
        return null;
      });
    });
    it('should start a locally scoped analytics instance', () => {
      const edgeAnalyticsEngineBaseUrl = faker.internet.url();
      const analyticsManifestId = faker.random.uuid();
      nock(`${ edgeAnalyticsEngineBaseUrl }`).post(`/analytics-instances/${ analyticsManifestId }/start`).reply(204);
      const p = Promise.try(() => {
        return edgeGatewayHelper.createEdgeGateway({
          edgeAnalyticsEngineBaseURL: edgeAnalyticsEngineBaseUrl
        });
      }).then((edgeGateway) => {
        return requests.cpost(app, `/api/analytics-instances/${ analyticsManifestId }/start?edgeGatewayReferenceID=${ edgeGateway._id }`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 204)
      ]);
    });

    it('should start a globally scoped analytics instance', () => {
      const p = Promise.try(() => {
        return analyticsInstanceHelper.createAnalyticsInstance();
      }).then((analyticsManifest) => {
        return requests.cpost(app, `/api/analytics-instances/${ analyticsManifest._id }/start`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 204)
      ]);
    });
  });
};

module.exports = testStopAnalyticsInstance;
