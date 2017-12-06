const exec = require('child-process-promise').exec;
const fs = require('fs');
const Promise = require('bluebird');

const logger = require('../../logger');

const _config = (eaProcessor) => {
  return {
    name: `ea-processor-${eaProcessor.id}`,
    config: {
      'connector.class': 'org.apache.kafka.connect.file.FileStreamSinkConnector',
      'key.converter': 'io.confluent.connect.avro.AvroConverter',          'key.converter.schema.registry.url': 'http://localhost:8081',
      'value.converter': 'io.confluent.connect.avro.AvroConverter',
      'value.converter.schema.registry.url': 'http://localhost:8081',
      'file': `${eaProcessor.configuration.file}`,
      'topics': `${eaProcessor.configuration.topic}`
    }
  };
};

const processor = {

  start: (eaProcessor) => {
    const path = `/tmp/ea-processor-${eaProcessor.id}.json`;
    return Promise.try(() => {
      logger.info(`Start ${eaProcessor.id}.`);
      return fs.writeFileSync(path, JSON.stringify(_config(eaProcessor)));
    }).then(() => {
      return exec(`${process.env.CONFLUENT_HOME}/bin/confluent load ea-processor-${eaProcessor.id} -d ${path}`);
    }).then(() => {
      logger.info(`Started ${eaProcessor.id}.`);
      return null;
    });
  },

  stop: (eaProcessor) => {
    return Promise.try(() => {
      logger.info(`Stop ${eaProcessor.id}.`);
      return exec(`${process.env.CONFLUENT_HOME}/bin/confluent unload ea-processor-${eaProcessor.id}`);
    }).then(() => {
      logger.info(`Stopped ${eaProcessor.id}.`);
      return null;
    });
  }

};

module.exports = processor;