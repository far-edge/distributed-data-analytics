const mongoose = require('mongoose');

// Data routes.
const DataRouteSchema = new mongoose.Schema({

  // Where to get the data from.
  start: {
    type: String,
    ref: 'DataSourceManifest',
    required: true
  },

  // Where to put the data.
  end: {
    type: String,
    ref: 'DataSourceManifest',
    required: true
  }

}, {
  collection: 'data-routes',
  timestamps: true
});

module.exports = mongoose.model('DataRoute', DataRouteSchema);
