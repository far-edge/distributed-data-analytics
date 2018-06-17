const Promise = require('bluebird');

const errors = require('../core/common/errors');
const logger = require('../core/common/loggers').get('SYSTEM');

// Authorizes the request with the given guard.
const authorize = (guard) => {
  return (req, res, next) => {
    return Promise.try(() => {
      return guard(req);
    }).then((authorized) => {
      if (authorized) {
        next();
      } else {
        next(new errors.ForbiddenError());
      }
      return null;
    }).catch((error) => {
      logger.error('Failed to apply guard.', error);
      next(new errors.ForbiddenError());
    });
  };
};

// Checks that at least one of the given guards pass.
const or = (guards) => {
  return (req) => {
    return Promise.all(guards.map((guard) => { return guard(req); })).then((results) => {
      return results.some((b) => { return b; });
    }).catch((error) => {
      logger.error('Failed to apply guard disjunction.', error);
      return false;
    });
  };
};

// Checks that all of the given guards pass.
const and = (guards) => {
  return (req) => {
    return Promise.all(guards.map((guard) => { return guard(req); })).then((results) => {
      return results.every((b) => { return b; });
    }).catch((error) => {
      logger.error('Failed to apply guard conjunction.', error);
      return false;
    });
  };
};

module.exports = {
  and,
  authorize,
  or
};
