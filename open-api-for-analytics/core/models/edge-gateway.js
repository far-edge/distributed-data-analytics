const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

const Location = require('./location');

// Edge gateways.
const EdgeGatewaySchema = new mongoose.Schema({

  // The ID of the edge gateway.
  _id: {
    type: String,
    default: uuidv4
  },

  // The name of the edge gateway.
  name: {
    type: String,
    required: true,
    unique: true
  },

  // The description of the edge gateway.
  description: {
    type: String,
    required: false
  },

  // The namespace of the edge gateway.
  namespace: {
    type: String,
    required: true,
    unique: true
  },

  // The MAC address of the edge gateway.
  macAddress: {
    type: String,
    required: true
  },

  // The location of the edge gateway.
  location: {
    type: Location,
    required: false
  },

  // The base URL to the data router and preprocessor of the edge gateway.
  dataRouterAndPreprocessorBaseURL: {
    type: String,
    required: true
  },

  // The base URL to the edge analytics engine of the edge gateway.
  edgeAnalyticsEngineBaseURL: {
    type: String,
    required: true
  },

  // Additional information about the edge gateway.
  additionalInformation: {
    type: [ String ],
    required: false
  },

}, {
  collection: 'edge-gateways',
  timestamps: true
});

EdgeGatewaySchema.set('toJSON', {
  transform: (doc, ret, _options) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

module.exports = mongoose.model('EdgeGateway', EdgeGatewaySchema);
