const faker = require('faker');
const Promise = require('bluebird');

const AnalyticsManifest = require('../../core/models/analytics-manifest');
const dataSources = require('./data-sources');

// Creates an analytics instance.
const createAnalyticsInstance = (overrides) => {
  return Promise.all([
    dataSources.registerDataSource({}),
    dataSources.registerDataSource({})
  ]).spread((dataSource, dataSink) => {
    const analyticsManifest = new AnalyticsManifest({
      ...{
        name: faker.random.words(2),
        analyticsProcessors: {
          apm: [
            {
              ...{
                name: faker.random.words(2),
                analyticsProcessorDefinitionReferenceID: faker.random.uuid(),
                dataSources: {
                  dataSource: [
                    {
                      dataSourceManifestReferenceID: dataSource._id
                    }
                  ]
                },
                dataSink: {
                  dataSourceManifestReferenceID: dataSink._id
                }
              },
              ...(faker.random.boolean() ? { description: faker.random.words(10) } : { }),
              ...(faker.random.boolean() ? {
                parameters: {
                  parameter: [
                    {
                      key: faker.random.words(2),
                      value: faker.random.boolean() ? faker.random.words(2) :
                        faker.random.number(0, 100)
                    }
                  ]
                }
              } : { })
            }
          ]
        }
      },
      ...(faker.random.boolean() ? { description: faker.random.words(10) } : { }),
      ...overrides
    });
    return analyticsManifest.save();
  }).then((analyticsManifest) => {
    return analyticsManifest.toObject();
  });
};

module.exports = {
  createAnalyticsInstance
};
