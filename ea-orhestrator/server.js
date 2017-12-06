const bodyParser = require('body-parser');
const compress = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');

const logger = require('./logger');
const routes = require('./routes/index');

mongoose.Promise = require('bluebird');

require('./models/index');

logger.info('Prepare the application.');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());
app.use('/api', routes);
app.use((_req, _res, _next) => {
  throw new Error('NOT_FOUND');
});
const handle = (error, req, res, _next) => {
  if (error.message === 'NOT_FOUND') {
    logger.error(`No route found for ${req.method} @ ${req.url}.`, error);
    res.status(404).json({ error: error.message });
  } else if (error.message === 'BAD_REQUEST') {
    logger.error(`Bad request for ${req.method} @ ${req.url}.`, error);
    res.status(400).json({ error: error.message });
  } else {
    logger.error(`Something went wrong for ${req.method} @ ${req.url}.`, error);
    res.status(500).json({ error: 'OOPS' });
  }
};
app.use(handle);
logger.info('Prepared the application.');

logger.info('Connect to the database.');
const mauth = process.env.MONGODB_USER || process.env.MONGODB_PASSWORD ?
  `${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@` : '';
const mhost = process.env.MONGODB_HOST;
const mport = process.env.MONGODB_PORT;
const mname = process.env.MONGODB_NAME;
mongoose.connect(`mongodb://${mauth}${mhost}:${mport}/${mname}`, {
  keepAlive: 1,
  useMongoClient: true
}).then(() => {
  logger.info(`Connected to ${mname} @ ${mhost}:${mport}.`);
}).catch((error) => {
  logger.error('Failed to connect to the database.', error);
  process.exit(1);
});

logger.info('Start the server.');
if (!module.parent) {
  const port = process.env.PORT;
  const host = process.env.HOST;
  app.listen(port, host, () => {
    logger.info(`Started server @ ${host}:${port}.`);
  });
}

module.exports = app;
