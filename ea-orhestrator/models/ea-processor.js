const mongoose = require('mongoose');

const EaProcessorSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true,
    unique: true
  },

  type: {
    type: String,
    required: true
  },

  configuration: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

  status: {
    type: String,
    enum: [ 'RUNNING', 'NOT_RUNNING' ],
    required: true,
    default: 'NOT_RUNNING'
  }

});

module.exports = mongoose.model('EaProcessor', EaProcessorSchema);
