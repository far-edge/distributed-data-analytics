const faker = require('faker');
const nock = require('nock');

const modelDiscoverer = require('../../../core/workers/model-discoverer');

// Tests the analytics processor definition fetch.
const testDiscoverAnalyticsProcessorDefinitions = () => {
  describe('discover analytics processor definitions', () => {
    it('should discover analytics processor definitions', () => {
      const id = faker.random.uuid();
      nock(`${ process.env.MODEL_REPOSITORY_BASE_URL }`)
        .post('/analytics-processor-definitions/discover', { id }).reply(200, {
          analyticsProcessorDefinitions: [{ id }]
        });
      const p = modelDiscoverer.discoverAnalyticsProcessorDefinitions({ id });
      return p.should.be.fulfilled;
    });
  });
};

module.exports = testDiscoverAnalyticsProcessorDefinitions;
