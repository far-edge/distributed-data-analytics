// "Something was wrong with the request you made."
class BadRequestError extends Error {
  constructor(message) {
    super(message || 'BAD_REQUEST');
    this.name = 'BadRequestError';
  }
}

// "I know who you are, but you did not have my permission to do this."
class ForbiddenError extends Error {
  constructor(message) {
    super(message || 'ACCESS_DENIED');
    this.name = 'ForbiddenError';
  }
}

// "You asked for something that I could not find."
class NotFoundError extends Error {
  constructor(message) {
    super(message || 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

// "I do not know who you are."
class UnauthorizedError extends Error {
  constructor(message) {
    super(message || 'UNKNOWN_ACCESSOR');
    this.name = 'UnauthorizedError';
  }
}

module.exports = {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError
};
