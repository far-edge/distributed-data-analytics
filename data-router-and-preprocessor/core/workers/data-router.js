const kafka = require('kafka-node');
const mqtt = require('async-mqtt');
const Promise = require('bluebird');
const uuidv4 = require('uuid/v4');

const DataRoute = require('../models/data-route');
const DataSourceManifest = require('../models/data-source-manifest');
const errors = require('../common/errors');
const { first } = require('../common/chisels');
const logger = require('../common/loggers').get('DATA-ROUTES');
const modelDiscoverer = require('../workers/model-discoverer');

// Everything about how to connect to MQTT topics.
const _mqtt = {
  brokers: { }
};

// Everything about how to connect to Kafka topics.
const _kafka = {
  client: null,
  producer: null,
  cache: { }
};

// Returns the name of a Kafka topic based on the name of the corresponding MQTT topic.
const _mqttTopic2KafkaTopic = (topic) => {
  return topic.replace(/\//g, '.');
};

// Creates the end of the data route from the given endpoint.
const _createDataRouteEnd = (start) => {
  logger.debug(`Create end for data route from ${ start._id }.`);
  return Promise.try(() => {
    // Discover the data source definition for the start.
    const id = start.dataSourceDefinitionReferenceID;
    return modelDiscoverer.discoverDataSourceDefinitions({
      _id: id
    }).then((dataSourceDefinitions) => {
      if (!dataSourceDefinitions.length) {
        logger.error(`Data source definition ${ id } does not exist.`);
        throw new errors.BadRequestError('DATA_SOURCE_DEFINITION_NOT_FOUND');
      }
      return dataSourceDefinitions[0];
    });
  }).then((dataSourceDefinition) => {
    // Discover the data kind for the start.
    const id = dataSourceDefinition.dataKindReferenceIDs.dataKindReferenceID[0];
    return modelDiscoverer.discoverDataKinds({
      _id: id
    }).then((dataKinds) => {
      if (!dataKinds.length) {
        logger.error(`Data kind ${ id } does not exist.`);
        throw new errors.BadRequestError('DATA_KIND_NOT_FOUND');
      }
      return dataKinds[0];
    });
  }).then((dataKind) => {
    return Promise.all([
      // Discover the data kind for the end (i.e., the data kind for the same queantity kind as the
      // start in JSON format).
      modelDiscoverer.discoverDataKinds({
        quantityKind: dataKind.quantityKind,
        format: 'JSON'
      }).then((dataKinds) => {
        if (!dataKinds.length) {
          logger.error(`Data kind for ${ dataKind.quantityKind } in JSON format does not exist.`);
          throw new errors.BadRequestError('DATA_KIND_NOT_FOUND');
        }
        return dataKinds[0];
      }),
      // Discover the data interface for the end (i.e., the data interface for Kafka).
      modelDiscoverer.discoverDataInterfaces({
        communicationProtocol: 'Kafka'
      }).then((dataInterfaces) => {
        if (!dataInterfaces.length) {
          logger.error('Data interface for Kafka does not exist.');
          throw new errors.BadRequestError('DATA_INTERFACE_NOT_FOUND');
        }
        return dataInterfaces[0];
      })
    ]);
  }).spread((dataKind, dataInterface) => {
    // Discover the data source definition for the end.
    return modelDiscoverer.discoverDataSourceDefinitions({
      dataKindReferenceID: dataKind._id,
      dataInterfaceReferenceID: dataInterface._id
    }).then((dataSourceDefinitions) => {
      if (!dataSourceDefinitions.length) {
        logger.error(`Data source definition for data kind ${ dataKind._id } does not exist.`);
        throw new errors.BadRequestError('DATA_SOURCE_DEFINITION_NOT_FOUND');
      }
      return dataSourceDefinitions[0];
    });
  }).then((dataSourceDefinition) => {
    // Create the end of the data route.
    const end = new DataSourceManifest({
      macAddress: process.env.MAC_ADDRESS,
      dataSourceDefinitionReferenceID: dataSourceDefinition._id,
      dataSourceDefinitionInterfaceParameters: {
        parameter: [
          {
            key: 'host',
            value: process.env.KAFKA_BROKER_HOST
          },
          {
            key: 'port',
            value: parseInt(process.env.KAFKA_BROKER_PORT)
          },
          {
            key: 'topic',
            value: first(start.dataSourceDefinitionInterfaceParameters.parameter.filter((p) => {
              return p.key === 'topic';
            }).map((p) => { return p.value; }).map((t) => { return _mqttTopic2KafkaTopic(t); }))
          }
        ]
      }
    });
    // Save the end of the data route.
    return end.save();
  }).then((end) => {
    logger.debug(`Created end for data route from ${ start._id }.`);
    return end;
  });
};

// Routes the given message that was published in the given topic.
const _routeMessage = (topic, message) => {
  logger.debug(`Route a message published @ ${ topic }.`);
  const timestamp = new Date().toJSON();
  new Promise((resolve, reject) => {
    // Construct the message to send to Kafka.
    // NOTE: The message is essentially a live data set.
    const ktopic = _mqttTopic2KafkaTopic(topic);
    const cached = _kafka.cache[ktopic];
    const data = {
      _id: uuidv4(),
      dataSourceManifestReferenceID: cached.dataSource,
      timestamp,
      observation: [
        {
          _id: uuidv4(),
          dataKindReferenceID: cached.dataKind,
          timestamp,
          value: message.toString()
        }
      ]
    };
    // Send the message to the corresponding topic in Kafka.
    _kafka.producer.send([{
      topic: _mqttTopic2KafkaTopic(topic),
      messages: [ JSON.stringify(data) ]
    }], (error, _data) => {
      if (error) {
        reject(error);
      } else {
        resolve(null);
      }
    });
  }).then(() => {
    logger.debug(`Routed a message published @ ${ topic }.`);
  }).catch((error) => {
    logger.error(`Failed to route a message published @ ${ topic }.`, error);
  });
  logger.debug(`Requested for a message published @ ${ topic } to be routed.`);
};

// Sets up the given data route.
const _setUpDataRoute = (dataRoute) => {
  logger.debug(`Set up data route from ${ dataRoute.start._id } to ${ dataRoute.end._id }.`);
  const parameters = dataRoute.start.dataSourceDefinitionInterfaceParameters.parameter;
  const protocol = first(parameters.filter((p) => { return p.key === 'protocol'; })).value;
  const host = first(parameters.filter((p) => { return p.key === 'host'; })).value;
  const topic = first(parameters.filter((p) => { return p.key === 'topic'; })).value;
  const port = first(parameters.filter((p) => { return p.key === 'port'; })).value;
  const url = `${ protocol }://${ host }:${ port }`;
  return Promise.try(() => {
    // Cache information about the data route.
    const id = dataRoute.start.dataSourceDefinitionReferenceID;
    return modelDiscoverer.discoverDataSourceDefinitions({
      _id: id
    }).then((dataSourceDefinitions) => {
      const dataKind = dataSourceDefinitions[0].dataKindReferenceIDs.dataKindReferenceID[0];
      _kafka.cache[_mqttTopic2KafkaTopic(topic)] = {
        dataSource: dataRoute.end._id,
        dataKind: dataKind
      };
      return null;
    });
  }).then(() => {
    // Connect to the MQTT broker (if needed).
    if (_mqtt.brokers[url]) {
      logger.debug(`Already connected to ${ url }.`);
      return null;
    }
    logger.debug(`Connect to ${ url }.`);
    return new Promise((resolve, reject) => {
      const client = mqtt.connect(url);
      client.on('connect', () => {
        resolve(client);
      });
      client.on('error', reject);
    }).then((client) => {
      client.on('message', _routeMessage);
      _mqtt.brokers[url] = { client, topics: [] };
      logger.debug(`Connected to ${ url }.`);
      return null;
    });
  }).then(() => {
    // Subscribe to the MQTT topic.
    const client = _mqtt.brokers[url].client;
    logger.debug(`Subscribe to ${ topic } @ ${ url }.`);
    return client.subscribe(topic).then(() => {
      // Add the topic to the subscribed topics for the broker.
      _mqtt.brokers[url].topics.push(topic);
      logger.debug(`Subscribed to ${ topic } @ ${ url }.`);
      return null;
    });
  }).then(() => {
    logger.debug(`Set up data route from ${ dataRoute.start._id } to ${ dataRoute.end._id }.`);
    return dataRoute;
  });
};

// Sets up a data route from the given endpoint.
const setUpDataRoute = (start) => {
  logger.debug(`Set up data route from ${ start._id }.`);
  // Data routes are set up only for MQTT topics.
  const protocol = start.dataSourceDefinitionInterfaceParameters &&
    start.dataSourceDefinitionInterfaceParameters.parameter ?
    first(start.dataSourceDefinitionInterfaceParameters.parameter.filter((p) => {
      return p.key === 'protocol';
    })) : null;
  const isMqttTopic = protocol && (protocol.value === 'mqtt' || protocol.value === 'mqtts');
  return Promise.try(() => {
    if (!isMqttTopic) {
      logger.debug(`Data route from ${ start._id } does not need to be set up.`);
      return null;
    }
    // Create the end of the data route.
    return _createDataRouteEnd(start).then((end) => {
      // Create the data route.
      const dataRoute = new DataRoute({
        start,
        end
      });
      // Save the data route.
      return dataRoute.save();
    }).then((dataRoute) => {
      // Set up the data route.
      return _setUpDataRoute(dataRoute);
    }).then((dataRoute) => {
      logger.debug(`Set up data route from ${ start._id }.`);
      return dataRoute;
    });
  }).catch((error) => {
    logger.error(`Failed to set up data route from ${ start._id }.`, error);
    throw error;
  });
};

// Tears down the data route from the given endpoint.
const tearDownDataRoute = (start) => {
  logger.debug(`Tear down data route from ${ start._id }.`);
  return Promise.try(() => {
    // Find the data route from the endpoint.
    return DataRoute.findOne({ start });
  }).then((dataRoute) => {
    // The data route does not ezist.
    // Nothing to tear down.
    if (!dataRoute) {
      logger.debug(`No data route from ${ start._id } to tear down.`);
      return null;
    }
    const parameters = start.dataSourceDefinitionInterfaceParameters.parameter;
    const protocol = first(parameters.filter((p) => { return p.key === 'protocol'; })).value;
    const host = first(parameters.filter((p) => { return p.key === 'host'; })).value;
    const topic = first(parameters.filter((p) => { return p.key === 'topic'; })).value;
    const port = first(parameters.filter((p) => { return p.key === 'port'; })).value;
    const url = `${ protocol }://${ host }:${ port }`;
    return Promise.try(() => {
      // Unsubscribe from the topic.
      logger.debug(`Unsubscribe from ${ topic } @ ${ url }.`);
      return _mqtt.brokers[url].client.unsubscribe(topic).then(() => {
        // Remove the topic from the subscribed topics for the broker.
        const index = _mqtt.brokers[url].topics.indexOf(topic);
        _mqtt.brokers[url].topics.splice(index, 1);
        logger.debug(`Unsubscribed from ${ topic } @ ${ url }.`);
        return null;
      });
    }).then(() => {
      if (_mqtt.brokers[url].topics.length) {
        logger.debug(`Stay connected to ${ url }.`);
        return null;
      }
      logger.debug(`Disconnect from ${ url }.`);
      return _mqtt.brokers[url].client.end().then(() => {
        logger.debug(`Disconnected from ${ url }.`);
        delete _mqtt.brokers[url];
        return null;
      });
    }).then(() => {
      logger.debug(`Tear down data route from ${ start._id }.`);
      return dataRoute;
    });
  }).catch((error) => {
    logger.error(`Failed to tear down data route from ${ start._id }.`, error);
    throw error;
  });
};

// Connect to Kafka.
const uri = `${ process.env.KAFKA_BROKER_HOST }:${ process.env.KAFKA_BROKER_PORT }`;
logger.info(`System connects to the stream @ ${ uri }.`);
_kafka.client = new kafka.KafkaClient({
  kafkaHost: uri
});
const producer = new kafka.HighLevelProducer(_kafka.client);
producer.on('ready', () => {
  _kafka.producer = producer;
  logger.info(`System connected to the stream @ ${ uri }.`);
  // Set up all data routes.
  logger.debug('Set up all data routes.');
  Promise.try(() => {
    // Find all data routes.
    return DataRoute.find({}).populate('end').populate('start');
  }).then((dataRoutes) => {
    // Set up all data routes.
    return Promise.map(dataRoutes, _setUpDataRoute);
  }).then((_dataRoutes) => {
    logger.debug('Set up all data routes.');
  });
});
producer.on('error', (error) => {
  logger.error(`Failed to connect to the stream @ ${ uri }.`, error);
});

module.exports = {
  setUpDataRoute,
  tearDownDataRoute
};
