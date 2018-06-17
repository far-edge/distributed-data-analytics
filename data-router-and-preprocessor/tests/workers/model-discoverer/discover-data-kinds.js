const faker = require('faker');
const nock = require('nock');

const modelDiscoverer = require('../../../core/workers/model-discoverer');

// Tests the data kind discovery.
const testDiscoverDataKinds = () => {
  describe('discover data kinds', () => {
    it('should discover data kinds', () => {
      const id = faker.random.uuid();
      nock(`${ process.env.MODEL_REPOSITORY_BASE_URL }`).post('/data-kinds/discover', {
        _id: id
      }).reply(200);
      const p = modelDiscoverer.discoverDataKinds({ _id: id });
      return p.should.be.fulfilled;
    });
  });
};

module.exports = testDiscoverDataKinds;
