const mongoose = require('mongoose');

// Geographical locations.
const GeoLocationSchema = new mongoose.Schema({

  // The latitude.
  latitude: {
    type: Number,
    required: true
  },

  // The longitude.
  longitude: {
    type: Number,
    required: true
  }

});

// Locations.
const LocationSchema = new mongoose.Schema({

  // The location is weither a geographical location...
  geoLocation: {
    type: GeoLocationSchema,
    required: false
  },

  // ...or a virtual location.
  virtualLocation: {
    type: String,
    required: false
  }

});

LocationSchema.statics.GeoLocation = GeoLocationSchema;

module.exports = LocationSchema;
