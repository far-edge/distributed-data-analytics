const Promise = require('bluebird');

const app = require('../../../server');
const dataSourceHelper = require('../../helpers/data-sources');
const requests = require('../../requests');

// Tests the data source discovery.
const testDiscoverDataSources = () => {
  describe('POST @ /data-sources/discover', () => {
    it('should discover data sources', () => {
      const p = Promise.try(() => {
        return dataSourceHelper.registerDataSource();
      }).then((dataSourceManifest) => {
        const data = {
          dataSourceDefinitionReferenceID: dataSourceManifest.dataSourceDefinitionReferenceID
        };
        return requests.cpost(app, '/api/data-sources/discover', data);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 200),
        p.should.eventually.have.property('body').that.has.property(
          'dataSources'
        ).with.length(1)
      ]);
    });
  });
};

module.exports = testDiscoverDataSources;
