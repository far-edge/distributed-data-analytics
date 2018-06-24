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

  // The data source manifest.
  dataSourceManifestReferenceID: {
    type: String,
    required: true
  }

});

// Data source manifest sets.
const DataSourceManifestsSchema = new mongoose.Schema({

  // The data source manifests.
  dataSource: {
    type: [ DataSourceManifestSchema ],
    required: true
  }

});

// Analytics processor manifest.
const AnalyticsProcessorManifestSchema = new mongoose.Schema({

  // The ID of the analytics processor.
  _id: {
    type: String,
    default: uuidv4
  },

  // The name of the analytics processor.
  name: {
    type: String,
    required: false
  },

  // The description of the analytics processor.
  description: {
    type: String,
    required: false
  },

  // The analytics processor definition that the analytics processor is based on.
  analyticsProcessorDefinitionReferenceID: {
    type: String,
    required: true
  },

  // The values for any parameters that the analytics processor definition of the analytics
  // processor has.
  parameters: {
    type: ParameterValuesSchema,
    required: false
  },

  // The data sink where the analytics processor puts its data.
  dataSink: {
    type: DataSourceManifestSchema,
    required: true
  },

  // The data sources where the analytics processor gets its data from.
  dataSources: {
    type: DataSourceManifestsSchema,
    required: true
  }

});

AnalyticsProcessorManifestSchema.set('toJSON', {
  transform: (doc, ret, _options) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

// Analytics processor manifest sets.
const AnalyticsProcessorManifestsSchema = new mongoose.Schema({

  // The analytics processor manifests.
  apm: {
    type: [ AnalyticsProcessorManifestSchema ],
    required: true
  }

});

// Analytics manifests.
const AnalyticsManifestSchema = new mongoose.Schema({

  // The ID of the analytics instance.
  _id: {
    type: String,
    default: uuidv4
  },

  // The name of the analytics instance.
  name: {
    type: String,
    required: true,
    unique: true
  },

  // The description of the analytics instance.
  description: {
    type: String,
    required: false
  },

  // The analytics processors in the analytics instance.
  analyticsProcessors: {
    type: AnalyticsProcessorManifestsSchema,
    required: true
  }

}, {
  collection: 'analytics-manifests',
  timestamps: true
});

AnalyticsManifestSchema.set('toJSON', {
  transform: (doc, ret, _options) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

module.exports = mongoose.model('AnalyticsManifest', AnalyticsManifestSchema);
