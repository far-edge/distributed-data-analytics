const faker = require('faker');
const nock = require('nock');

const dataSourceDiscoverer = require('../../../core/workers/data-source-discoverer');

// Tests the data source discovery.
const testDiscoverDataSources = () => {
  describe('discover data sources', () => {
    it('should discover data sources', () => {
      const id = faker.random.uuid();
      nock(`${ process.env.DATA_ROUTER_AND_PREPROCESSOR_BASE_URL }`)
        .post('/data-sources/discover', { id }).reply(200, {
          dataSources: [{ id }]
        });
      const p = dataSourceDiscoverer.discoverDataSources({ id });
      return p.should.be.fulfilled;
    });
  });
};

module.exports = testDiscoverDataSources;
