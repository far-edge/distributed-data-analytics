const bodyParser = require('body-parser');
const compress = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const expressWinston = require('express-winston');
const helmet = require('helmet');
const morgan = require('morgan');

const errors = require('./core/common/errors');
const handle = require('./middlewares/handle-errors');
const hooks = require('./hooks/index');
const logger = require('./core/common/loggers').get('HTTP');
const routes = require('./routes/index');

const app = express();

// If the log level is debug, log all HTTP requests and responses.
if (process.env.LOG_LEVEL === 'debug') {
  app.use(morgan('dev'));
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: 'HTTP {{ req.method }} {{ req.url }} {{ res.statusCode }} {{ res.responseTime }}ms',
    colorStatus: true
  }));
}

// Parse body parameters and attach them to req.body.
const limit = `${ process.env.MAX_REQUEST_BODY_SIZE }kb`;
app.use(bodyParser.json({ limit }));
app.use(bodyParser.urlencoded({ extended: true, limit }));

app.use(cookieParser());
app.use(compress());

// Secure the application by setting various HTTP headers.
app.use(helmet());

// Enable CORS (Cross Origin Resource Sharing).
app.use(cors());

// Mount application routes on /api path.
app.use('/api', routes);

// Mount hooks on /hooks path.
app.use('/hooks', hooks);

// Catch requests to unknown endpoints, and forward them to the error handler.
app.use((req, _res, _next) => {
  throw new errors.NotFoundError(`Nothing to ${ req.method } @ ${ req.url }.`);
});

// Set the error handler.
app.use(handle);

module.exports = app;
