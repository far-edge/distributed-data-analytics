const Promise = require('bluebird');
const sinon = require('sinon');

const AIM = require('../../../core/workers/analytics-instance-manager');
const analyticsInstanceHelper = require('../../helpers/analytics-instances');
const app = require('../../../server');
const requests = require('../../requests');
const State = require('../../../core/models/state');

// Tests the analytics instance start.
const testStartAnalyticsInstance = () => {
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
    it('should start an analytics instance', () => {
      const p = Promise.try(() => {
        return analyticsInstanceHelper.createAnalyticsInstance({});
      }).then((analyticsInstance) => {
        return requests.cpost(app, `/api/analytics-instances/${ analyticsInstance._id }/start`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 204)
      ]);
    });
  });
};

module.exports = testStartAnalyticsInstance;
