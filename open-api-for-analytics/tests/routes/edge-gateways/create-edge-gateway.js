const faker = require('faker');
const Promise = require('bluebird');

const app = require('../../../server');
const requests = require('../../requests');

// Tests the edge gateway creation.
const testCreateEdgeGateway = () => {
  describe('POST @ /edge-gateways', () => {
    it('should create an edge gateway', () => {
      const data = {
        ...{
          name: faker.random.words(2),
          namespace: faker.internet.url(),
          macAddress: faker.internet.mac(),
          dataRouterAndPreprocessorBaseURL: faker.internet.url(),
          edgeAnalyticsEngineBaseURL: faker.internet.url(),
        },
        ...(faker.random.boolean() ? {
          location: {
            ...(faker.random.boolean() ? {
              geoLocation: {
                latitude: faker.address.latitude(),
                longitude: faker.address.longitude()
              }
            } : {
              virtualLocation: faker.random.words(2)
            })
          },
        } : { }),
        ...(faker.random.boolean() ? { description: faker.random.words(10) } : { }),
        ...(faker.random.boolean() ? { additionalInformation: [ faker.random.words(10) ] } : { })
      };
      const p = Promise.try(() => {
        return requests.cpost(app, '/api/edge-gateways', data);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 201),
        p.should.eventually.have.property('body').that.is.an('object')
      ]);
    });
  });
};

module.exports = testCreateEdgeGateway;
