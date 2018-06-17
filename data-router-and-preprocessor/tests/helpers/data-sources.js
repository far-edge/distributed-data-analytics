const faker = require('faker');
const Promise = require('bluebird');

const DataSourceManifest = require('../../core/models/data-source-manifest');

// Registers a data source.
const registerDataSource = (overrides) => {
  const dataSourceManifest = new DataSourceManifest({
    ...{
      macAddress: faker.internet.mac(),
      dataSourceDefinitionReferenceID: faker.random.uuid()
    },
    ...(faker.random.boolean() ? {
      dataSourceDefinitionInterfaceParameters: {
        parameter: [
          {
            key: faker.random.words(2),
            value: faker.random.boolean() ? faker.random.words(2) : faker.random.number(0, 100)
          }
        ]
      }
    } : { }),
    ...overrides
  });
  return Promise.try(() => {
    return dataSourceManifest.save();
  }).then((dataSourceManifest) => {
    return dataSourceManifest.toObject();
  });
};

module.exports = {
  registerDataSource
};
