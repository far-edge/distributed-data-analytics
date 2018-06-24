const errors = require('../core/common/errors');
const validations = require('../core/common/validations');

const _lookup = (message) => {
  let name = message.context.key;
  name = name.replace('ID', 'Id').replace('URL', 'Url');
  while (name.match(/[A-Z]/)) {
    const x = /([^A-Z]*)([A-Z])(.*)/.exec(name);
    name = `${x[1]}_${x[2].toLowerCase()}${x[3]}`;
  }
  let prefix = '';
  switch (message.type) {
    case 'any.required':
      prefix = 'MISSING';
      break;
    default:
      prefix = 'INVALID';
  }
  return `${prefix}_${name.toUpperCase()}`;
};

// Validates a request based on the given blueprint.
const validate = (blueprint) => {
  return (req, res, next) => {
    const options = {
      abortEarly: true,
      allowUnknown: true,
      stripUnknown: true,
      convert: true
    };
    validations.validate(req, blueprint, options, (error, value) => {
      if (error) {
        const code = _lookup(error.details[0]);
        throw new errors.BadRequestError(code);
      }
      Object.keys(value).forEach((key) => {
        req[key] = value[key];
      });
      next();
    });
  };
};

module.exports = validate;
