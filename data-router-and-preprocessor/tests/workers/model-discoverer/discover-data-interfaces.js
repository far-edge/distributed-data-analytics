const faker = require('faker');
const nock = require('nock');

const modelDiscoverer = require('../../../core/workers/model-discoverer');

// Tests the data interface discovery.
const testDiscoverDataIntefaces = () => {
  describe('discover data interfaces', () => {
    it('should discover data interfaces', () => {
      const id = faker.random.uuid();
      nock(`${ process.env.MODEL_REPOSITORY_BASE_URL }`).post('/data-interfaces/discover', {
        id
      }).reply(200, {
        dataInterfaces: [ ]
      });
      const p = modelDiscoverer.discoverDataInterfaces({ id });
      return p.should.be.fulfilled;
    });
  });
};

module.exports = testDiscoverDataIntefaces;
