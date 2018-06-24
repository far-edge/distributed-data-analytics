const Promise = require('bluebird');

const logger = require('../core/common/loggers').get('SYSTEM');

const _code = (method, output) => {
  if (!output) {
    return 204;
  }
  const name = method.name;
  if (!name) {
    return 200;
  }
  if (name.match(/^(create|register)/)) {
    return 201;
  }
  return 200;
};

const _headers = (method, output) => {
  const name = method.name;
  if (name && name.match(/^(create|register)/)) {
    let model = `${name.charAt(6).toLowerCase()}${name.substring(7)}s`;
    while (model.match(/[A-Z]/)) {
      const x = /([^A-Z]*)([A-Z])(.*)/.exec(model);
      model = `${x[1]}-${x[2].toLowerCase()}${x[3]}`;
    }
    return {
      Location: `${process.env.API_BASE_URL}/${model}/${output._id}`
    };
  }
  return {};
};

const _gather = (req) => {
  const input = { };
  Object.keys(req.headers).forEach((key) => {
    if (input[key] !== undefined) {
      logger.warn(`Key ${key} found @ headers already exists, and will be overwritten.`);
    }
    input[key] = req.headers[key];
  });
  Object.keys(req.params).forEach((key) => {
    if (input[key] !== undefined) {
      logger.warn(`Key ${key} found @ params already exists, and will be overwritten.`);
    }
    input[key] = req.params[key];
  });
  Object.keys(req.query).forEach((key) => {
    if (input[key] !== undefined) {
      logger.warn(`Key ${key} found @ query already exists.`);
    }
    input[key] = req.query[key];
  });
  Object.keys(req.body).forEach((key) => {
    if (input[key] !== undefined) {
      logger.warn(`Key ${key} found @ body already exists.`);
    }
    input[key] = req.body[key];
  });
  if (req.files) {
    if (input.files !== undefined) {
      logger.warn('Key files already exists.');
    }
    input.files = req.files;
  }
  return Object.assign(input, req.pod || { });
};

const _scatter = (output) => {
  return {
    body: output,
    headers: { 'Content-Type': 'application/json' }
  };
};

// Calls the given HTTP agnostic method.
// Gathers its input from the HTTP request, and scatters its output to the HTTP response.
const lift = (method, gather, scatter) => {
  return (req, res, next) => {
    Promise.try(() => {
      const input = (gather || _gather)(req);
      return method(input);
    }).then((output) => {
      const { body, headers } = (scatter || _scatter)(output);
      res.locals.content = body;
      res.locals.code = _code(method, output);
      res.locals.headers = Object.assign(_headers(method, output), headers);
      next();
    }).catch(next);
  };
};

module.exports = lift;
