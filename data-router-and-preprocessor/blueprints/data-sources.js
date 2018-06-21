const validations = require('../core/common/validations');

const _parameter = validations.object().keys({
  key: validations.string().required(),
  value: validations.any().required()
});

// How to discover data sources.
const discoverDataSources = {
  body: {
    id: validations.id().allow('').allow(null).optional(),
    name: validations.string().allow('').allow(null).optional(),
    description: validations.string().allow('').allow(null).optional(),
    dataSourceDefinitionReferenceID: validations.id().allow('').allow(null).optional()
  }
};

// How to register a data source.
const registerDataSource = {
  body: {
    name: validations.string().allow('').allow(null).optional(),
    description: validations.string().allow('').allow(null).optional(),
    macAddress: validations.string().required(),
    dataSourceDefinitionReferenceID: validations.id().required(),
    dataSourceDefinitionInterfaceParameters: validations.object().keys({
      parameter: validations.array().items(_parameter).required()
    }).optional()
  }
};

// How to unregister a data source.
const unregisterDataSource = {
  params: {
    id: validations.id().required()
  }
};

module.exports = {
  discoverDataSources,
  registerDataSource,
  unregisterDataSource
};
