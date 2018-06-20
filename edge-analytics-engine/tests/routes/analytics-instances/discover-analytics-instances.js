const faker = require('faker');
const Promise = require('bluebird');
const sinon = require('sinon');

const AIM = require('../../../core/workers/analytics-instance-manager');
const analyticsInstanceHelper = require('../../helpers/analytics-instances');
const app = require('../../../server');
const requests = require('../../requests');
const State = require('../../../core/models/state');

// Tests the analytics instance discovery.
const testDiscoverAnalyticsInstances = () => {
  describe('POST @ /analytics-instances/discover', () => {
    before(() => {
      return Promise.try(() => {
        const state = faker.random.arrayElement(State.ALL);
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
    it('should discover analytics instances', () => {
      const p = Promise.try(() => {
        return analyticsInstanceHelper.createAnalyticsInstance({});
      }).then((analyticsInstance) => {
        const data = {
          id: analyticsInstance._id
        };
        return requests.cpost(app, '/api/analytics-instances/discover', data);
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
