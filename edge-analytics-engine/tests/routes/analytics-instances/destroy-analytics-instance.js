const Promise = require('bluebird');
const sinon = require('sinon');

const AIM = require('../../../core/workers/analytics-instance-manager');
const analyticsInstanceHelper = require('../../helpers/analytics-instances');
const app = require('../../../server');
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
    it('should destroy an analytics instance', () => {
      const p = Promise.try(() => {
        return analyticsInstanceHelper.createAnalyticsInstance({ });
      }).then((analyticsInstance) => {
        return requests.cdelete(app, `/api/analytics-instances/${ analyticsInstance._id }`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 204)
      ]);
    });
  });
};

module.exports = testDestroyAnalyticsInstance;
