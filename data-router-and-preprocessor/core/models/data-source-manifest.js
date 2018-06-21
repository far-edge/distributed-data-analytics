const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

// Parameter values.
const ParameterValueSchema = new mongoose.Schema({

  // The name of the parameter.
  key: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

  // The value of the parameter.
  value: {
    type: String,
    required: false
  }

});

// Parameter value sets.
const ParameterValuesSchema = new mongoose.Schema({

  // The parameter values.
  parameter: {
    type: [ ParameterValueSchema ],
    required: true
  }

});

// Data source manifests.
const DataSourceManifestSchema = new mongoose.Schema({

  // The ID of the data source.
  _id: {
    type: String,
    default: uuidv4
  },

  // The name of the data source.
  name: {
    type: String,
    required: true,
    unique: true
  },

  // The description of the data source.
  description: {
    type: String,
    required: false
  },

  // The MAC address of the device that the data source is connected with.
  macAddress: {
    type: String,
    required: true
  },

  // The data source definition that the data source is based on.
  dataSourceDefinitionReferenceID: {
    type: String,
    required: true
  },

  // The values for any parameters that the data interface of the data source definition of the
  // data source has.
  dataSourceDefinitionInterfaceParameters: {
    type: ParameterValuesSchema,
    required: false
  }

}, {
  collection: 'data-source-manifests',
  timestamps: true
});

DataSourceManifestSchema.set('toJSON', {
  transform: (doc, ret, _options) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

module.exports = mongoose.model('DataSourceManifest', DataSourceManifestSchema);
