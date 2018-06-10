const Joi = require('joi');
const mqtt = require('mqtt');
const winston = require('winston');

// Configure the logger.
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(Object.assign({
      json: false,
      prettyPrint: true,
      humanReadableUnhandledException: true,
      colorize: true,
      level: process.env.LOG_LEVEL,
      timestamp: true,
      silent: process.env.NODE_ENV === 'test'
    }))
  ]
});

// Validate the environment.
const schema = Joi.object({
  LOG_LEVEL: Joi.string().allow([
    'debug',
    'error',
    'info',
    'warn'
  ]).required(),
  MAX_VALUE: Joi.number().required(),
  MIN_VALUE: Joi.number().required(),
  MQTT_BROKER_URL: Joi.string().required(),
  MQTT_TOPIC: Joi.string().required(),
  NAME: Joi.string().required(),
  NODE_ENV: Joi.string().allow([
    'development',
    'production',
    'staging',
    'test'
  ]).required(),
  VALUE_INTERVAL: Joi.number().min(1).required()
}).unknown().required();
const { error, value: _env } = Joi.validate(process.env, schema);
if (error) {
  logger.error(`The environment is invalid (cause: ${ error.details[0].message }).`);
  process.exit(1);
}

// Connect to the MQTT broker.
const client = mqtt.connect(process.env.MQTT_BROKER_URL);

client.on('connect', () => {
  const topic = process.env.MQTT_TOPIC;
  const min = parseInt(process.env.MIN_VALUE);
  const max = parseInt(process.env.MAX_VALUE);

  // Subscribe to the topic.
  logger.debug(`Subscribe to topic ${topic}.`);
  client.subscribe(topic);
  logger.debug(`Subscribed to topic ${topic}.`);

  // Every process.env.VALUE_INTERVAL seconds...
  setInterval(() => {
    // ...generate a random value within the range...
    const value = min + Math.ceil(Math.random() * (max - min));
    // ...and publish it...
    logger.debug(`Publish value ${value} to topic ${topic}.`);
    client.publish(topic, value.toString());
    logger.debug(`Published value ${value} to topic ${topic}.`);
  }, parseInt(process.env.VALUE_INTERVAL) * 1000);
});

client.on('error', (error) => {
  logger.error('Something went wrong.', error);
});

if (!module.parent) {
  logger.info(`Random value generator for topic ${process.env.MQTT_TOPIC} started.`);
}
