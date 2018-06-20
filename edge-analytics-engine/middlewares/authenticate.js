const Promise = require('bluebird');

const errors = require('../core/common/errors');
const logger = require('../core/common/loggers').get('SYSTEM');

// Authenticates the request with the given strategy.
const authenticate = (strategy) => {
  return (req, res, next) => {
    return Promise.try(() => {
      return strategy(req);
    }).then((authenticated) => {
      if (authenticated) {
        next();
      } else {
        next(new errors.UnauthorizedError());
      }
      return null;
    }).catch((error) => {
      logger.error('Failed to apply strategy.', error);
      next(new errors.UnauthorizedError());
    });
  };
};

module.exports = authenticate;
