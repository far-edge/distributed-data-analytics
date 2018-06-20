const winston = require('winston');

// The components for which loggers have already been configured.
const _components = [];

// Gets the logger for the given component.
const get = (component) => {
  // Configure the logger or the component, if needed.
  if (_components.indexOf(component) === -1) {
    const options = {
      json: false,
      prettyPrint: true,
      humanReadableUnhandledException: true,
      colorize: true,
      level: process.env.LOG_LEVEL,
      label: component,
      timestamp: true
    };
    winston.loggers.add(component, {
      transports: [
        new (winston.transports.Console)(Object.assign(options, {
          silent: process.env.NODE_ENV === 'test'
        }))
      ]
    });
    _components.push(component);
  }
  // Grab the configured logger, and return it.
  return winston.loggers.get(component);
};

module.exports = {
  get
};
