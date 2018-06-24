const validations = require('../core/common/validations');

const _location = validations.object().keys({
  virtualLocation: validations.string().allow('').allow(null).optional(),
  geoLocation: validations.object().keys({
    latitude: validations.number().required(),
    longitude: validations.number().required()
  })
});

// How to create an edge gateway.
const createEdgeGateway = {
  body: {
    name: validations.string().required(),
    description: validations.string().allow('').allow(null).optional(),
    namespace: validations.string().required(),
    macAddress: validations.string().required(),
    location: _location.optional(),
    dataRouterAndPreprocessorBaseURL: validations.string().uri().required(),
    edgeAnalyticsEngineBaseURL: validations.string().uri().required(),
    additionalInformation: validations.array().items(validations.string()).optional()
  }
};

// How to delete an edge gateway.
const deleteEdgeGateway = {
  params: {
    id: validations.id().required()
  }
};

// How to discover edge gateways.
const discoverEdgeGateways = {
  body: {
    id: validations.id().allow('').allow(null).optional(),
    name: validations.string().allow('').allow(null).optional(),
    namespace: validations.string().allow('').allow(null).optional(),
    macAddress: validations.string().allow('').allow(null).optional()
  }
};

// How to get an edge gateway.
const getEdgeGateway = {
  params: {
    id: validations.id().required()
  }
};

// How to update an edge gateway.
const updateEdgeGateway = {
  params: {
    id: validations.id().required()
  },
  body: {
    name: validations.string().required(),
    description: validations.string().allow('').allow(null).optional(),
    namespace: validations.string().required(),
    macAddress: validations.string().required(),
    location: _location.optional(),
    dataRouterAndPreprocessorBaseURL: validations.string().uri().required(),
    edgeAnalyticsEngineBaseURL: validations.string().uri().required(),
    additionalInformation: validations.array().items(validations.string()).optional()
  }
};

module.exports = {
  createEdgeGateway,
  deleteEdgeGateway,
  discoverEdgeGateways,
  getEdgeGateway,
  updateEdgeGateway
};
