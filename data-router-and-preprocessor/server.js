const dblogger = require('./core/common/loggers').get('DB');
const logger = require('./core/common/loggers').get('SERVER');
const mongoose = require('mongoose');
const util = require('util');

const app = require('./app');
const blueprint = require('./blueprints/env');
const validations = require('./core/common/validations');

// Validate the environment.
const { error, value: _env } = validations.validate(process.env, blueprint);
if (error) {
  logger.error(`The environment is invalid (cause: ${ error.details[0].message }).`);
  process.exit(1);
}

// Load all models.
require('./core/models/index');

// Load all loaders.
require('./core/loaders/index');

// Load all workers.
require('./core/workers/index');

// Connect to the database.
const auth = process.env.MONGODB_USER || process.env.MONGODB_PASSWORD ?
  `${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@` : '';
const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const name = process.env.MONGODB_NAME;
const uriwa = `mongodb://${ host }:${ port }/${ name }`;
const uri = `mongodb://${ auth }${ host }:${ port }/${ name }`;
logger.info(`System connects to the database @ ${ uriwa }.`);
mongoose.connect(uri, {
  keepAlive: 1,
  poolSize: process.env.MONGODB_POOL_SIZE
}).then(() => {
  logger.info(`System connected to the database @ ${ uriwa }.`);
}).catch((error) => {
  logger.error(`System failed to connect to the database @ ${ uriwa }.`, error);
});

// Log more details when the log level is debug.
if (process.env.LOG_LEVEL === 'debug') {
  mongoose.set('debug', (collection, method, query, doc) => {
    const iquery = util.inspect(query, false, 30);
    const idoc = util.inspect(doc, false, 30);
    dblogger.debug(`${ collection }.${ method } ${ iquery } ${ idoc }`);
  });
}

// Bind and listen for connections on the given port and host.
if (!module.parent) {
  app.listen(process.env.PORT, process.env.HOST, () => {
    logger.info(`Server started in ${process.env.NODE_ENV} mode on port ${ process.env.PORT }.`);
  });
}

module.exports = app;
