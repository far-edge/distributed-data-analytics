const winston = require('winston');

const options = {
  json: false,
  prettyPrint: true,
  humanReadableUnhandledException: true,
  colorize: true,
  level: process.env.LOG_LEVEL
};

const logger = new (winston.Logger)({
  transports: [ new (winston.transports.Console)(options) ]
});

module.exports = logger;
