const mongoose = require('mongoose');

const EaProcessorTypeSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    unique: true
  }

});

module.exports = mongoose.model('EaProcessorType', EaProcessorTypeSchema);
