const faker = require('faker');
const Promise = require('bluebird');
const sinon = require('sinon');

const AIM = require('../../../core/workers/analytics-instance-manager');
const analyticsInstanceHelper = require('../../helpers/analytics-instances');
const app = require('../../../server');
const requests = require('../../requests');
const State = require('../../../core/models/state');

// Tests the analytics instance state retrieval.
const testGetAnalyticsInstanceState = () => {
  describe('GET @ /analytics-instances/:id/state', () => {
    const state = faker.random.arrayElement(State.ALL);
    before(() => {
      return Promise.try(() => {
        const stub = sinon.stub(AIM, 'getAnalyticsInstanceState');
        stub.returns(Promise.resolve(state));
        return null;
      });
    });
    after(() => {
      return Promise.try(() => {
        AIM.getAnalyticsInstanceState.restore();
        return null;
      });
    });
    it('should get the state of an analytics instance', () => {
      const p = Promise.try(() => {
        return analyticsInstanceHelper.createAnalyticsInstance({});
      }).then((analyticsInstance) => {
        return requests.cget(app, `/api/analytics-instances/${ analyticsInstance._id }/state`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 200),
        p.should.eventually.have.property('body').that.has.property(
          'state'
        ).equal(state)
      ]);
    });
  });
};

module.exports = testGetAnalyticsInstanceState;
