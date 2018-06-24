const Promise = require('bluebird');
const sinon = require('sinon');

const AIM = require('../../../core/workers/analytics-instance-manager');
const analyticsInstanceHelper = require('../../helpers/analytics-instances');
const app = require('../../../server');
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
    it('should stop an analytics instance', () => {
      const p = Promise.try(() => {
        return analyticsInstanceHelper.createAnalyticsInstance({});
      }).then((analyticsInstance) => {
        return requests.cpost(app, `/api/analytics-instances/${ analyticsInstance._id }/stop`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 204)
      ]);
    });
  });
};

module.exports = testStopAnalyticsInstance;
