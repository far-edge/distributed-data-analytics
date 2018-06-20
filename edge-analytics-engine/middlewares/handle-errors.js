const callsite = require('callsite-record');
const util = require('util');

const logger = require('../core/common/loggers').get('SYSTEM');

// Handles all errors.
const handle = (error, req, res, _next) => {
  if (error.name === 'UnauthorizedError') {
    logger.error(`A stranger tried to illegally ${req.method} @ ${req.url}.`);
    res.status(401).json({
      error: 'UNKNOWN_ACCESSOR'
    });
  } else if (error.name === 'ForbiddenError') {
    logger.error(`A friend tried to illegally ${req.method} @ ${req.url}.`);
    res.status(403).json({
      error: 'ACCESS_DENIED'
    });
  } else if (error.name === 'NotFoundError') {
    logger.error(`Something was not found for ${req.method} @ ${req.url}.`);
    res.status(404).json({
      error: error.message
    });
  } else if (error.name === 'BadRequestError') {
    logger.error(`Something was bad for ${req.method} @ ${req.url}.`);
    res.status(400).json({
      error: error.message
    });
  } else {
    logger.error(`Something went wrong for ${req.method} @ ${req.url}.`);
    res.status(500).json({
      error: 'FAILED'
    });
  }
  const cError = callsite({ forError: error });
  const pError = (cError) ? cError.renderSync({
    stackFilter(frame) {
      return !frame.getFileName().includes('node_modules');
    }
  }) : util.inspect(error, false, null);
  logger.error(cError ? `${error.message}\n${pError}` : pError);
};

module.exports = handle;
