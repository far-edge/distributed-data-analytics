const Enum = require('../common/enums');

// Analytics instance states.
const State = new Enum([
  'STOPPED',
  'RUNNING'
]);

module.exports = State;
