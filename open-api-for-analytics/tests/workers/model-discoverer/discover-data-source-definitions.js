const faker = require('faker');
const nock = require('nock');

const modelDiscoverer = require('../../../core/workers/model-discoverer');

// Tests the data source definition discovery.
const testDiscoverDataSourceDefinitions = () => {
  describe('discover data source definitions', () => {
    it('should discover data source definitions', () => {
      const id = faker.random.uuid();
      nock(`${ process.env.MODEL_REPOSITORY_BASE_URL }`).post('/data-source-definitions/discover', {
        id
      }).reply(200, {
        dataSourceDefinitions: [ ]
      });
      const p = modelDiscoverer.discoverDataSourceDefinitions({ id });
      return p.should.be.fulfilled;
    });
  });
};

module.exports = testDiscoverDataSourceDefinitions;
