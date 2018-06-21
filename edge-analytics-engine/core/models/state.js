const Enum = require('../common/enums');

// Analytics instance states.
const State = new Enum([
  // Something failed to run.
  'FAILED',

  // Something is running.
  'RUNNING',

  // Something in not running.
  'STOPPED'
]);

module.exports = State;
