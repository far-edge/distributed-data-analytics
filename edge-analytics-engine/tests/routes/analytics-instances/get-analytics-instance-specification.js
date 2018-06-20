const Promise = require('bluebird');

const analyticsInstanceHelper = require('../../helpers/analytics-instances');
const app = require('../../../server');
const requests = require('../../requests');

// Tests the analytics instance specification retrieval.
const testGetAnalyticsInstanceSpecification = () => {
  describe('GET @ /analytics-instance/:id/specification', () => {
    it('should get the specification of an analytics instance', () => {
      const p = Promise.try(() => {
        return analyticsInstanceHelper.createAnalyticsInstance({});
      }).then((analyticsInstance) => {
        const id = analyticsInstance._id;
        return requests.cget(app, `/api/analytics-instances/${ id }/specification`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 200),
        p.should.eventually.have.property('body').that.is.an('object')
      ]);
    });
  });
};

module.exports = testGetAnalyticsInstanceSpecification;
