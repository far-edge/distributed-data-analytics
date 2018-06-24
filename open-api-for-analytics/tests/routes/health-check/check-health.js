const Promise = require('bluebird');

const app = require('../../../server');
const requests = require('../../requests');

// Tests the health check.
const testCheckHealth = () => {
  describe('GET @ /health-check', () => {
    it('should check the health of the open API for analytics', () => {
      const p = Promise.try(() => {
        return requests.cget(app, '/api/health-check');
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 200),
        p.should.eventually.have.property('body').that.is.an('object')
      ]);
    });
  });
};

module.exports = testCheckHealth;
