const Promise = require('bluebird');

const app = require('../../../server');
const dataSourceHelper = require('../../helpers/data-sources');
const requests = require('../../requests');

// Tests the data source unregistration.
const testUnregisterDataSource = () => {
  describe('DELETE @ /data-sources/:id', () => {
    it('should unregister a data source', () => {
      const p = Promise.try(() => {
        return dataSourceHelper.registerDataSource();
      }).then((dataSourceManifest) => {
        return requests.cdelete(app, `/api/data-sources/${ dataSourceManifest._id }`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 204)
      ]);
    });
  });
};

module.exports = testUnregisterDataSource;
