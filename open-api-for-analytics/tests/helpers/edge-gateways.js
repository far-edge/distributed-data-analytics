const faker = require('faker');
const Promise = require('bluebird');

const EdgeGateway = require('../../core/models/edge-gateway');

// Creates an edge gateway.
const createEdgeGateway = (overrides) => {
  const edgeGateway = new EdgeGateway({
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
    ...(faker.random.boolean() ? { additionalInformation: [ faker.random.words(10) ] } : { }),
    ...overrides
  });
  return Promise.try(() => {
    return edgeGateway.save();
  }).then((edgeGateway) => {
    return edgeGateway.toObject();
  });
};

module.exports = {
  createEdgeGateway
};
