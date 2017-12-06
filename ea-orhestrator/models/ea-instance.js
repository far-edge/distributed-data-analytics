const mongoose = require('mongoose');

const EaInstanceSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true,
    unique: true
  },

  processors: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EaProcessor'
    }],
    required: true
  },

  status: {
    type: String,
    enum: [ 'RUNNING', 'NOT_RUNNING' ],
    required: true,
    default: 'NOT_RUNNING'
  }

});

module.exports = mongoose.model('EaInstance', EaInstanceSchema);
