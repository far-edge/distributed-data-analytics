const Promise = require('bluebird');

const EaInstance = require('../models/ea-instance');
const EaProcessor = require('../models/ea-processor');
const logger = require('../logger');

const getEaInstances = (req, res, next) => {
  return Promise.try(() => {
    return EaInstance.find({});
  }).then((eaInstances) => {
    res.status(200).json({ eaInstances });
  }).catch((error) => {
    next(error);
  });
};

const launchEaInstance = (req, res, next) => {
  logger.info('Launch a new EaInstance.');
  return Promise.try(() => {
    return EaInstance.findOne({ id: req.body.id }).then((eaInstance) => {
      if (eaInstance) {
        throw new Error('BAD_REQUEST');
      }
    }).then(() => {
      return Promise.map(req.body.processors, (p) => {
        return EaProcessor.findOne({ id: p.id }).then((eaProcessor) => {
          if (eaProcessor) {
            throw new Error('BAD_REQUEST');
          }
        });
      });
    });
  }).then(() => {
    return Promise.map(req.body.processors, (p) => {
      const eaProcessor = new EaProcessor(p);
      return eaProcessor.save();
    })
  }).then((processors) => {
    const eaInstance = new EaInstance(req.body);
    eaInstance.processors = processors;
    return eaInstance.save();
  }).then((eaInstance) => {
    return Promise.map(eaInstance.processors, (eaProcessor) => {
      const type = require(`../ea-processor-types/${eaProcessor.type}`);
      return type.start(eaProcessor);
    }).then(() => {
      eaInstance.status = 'RUNNING';
      return eaInstance.save();
    }).then(() => {
      return Promise.map(eaInstance.processors, (eaProcessor) => {
        eaProcessor.status = 'RUNNING';
        return eaProcessor.save();
      });
    }).then(() => {
      logger.info(`Launched ${eaInstance.id}.`);
      res.status(201).json(eaInstance);
    });
  }).catch((error) => {
    next(error);
  });
};

const terminateEaInstance = (req, res, next) => {
  logger.info(`Terminate ${req.params.id}.`);
  return Promise.try(() => {
    return EaInstance.findOne({ id: req.params.id }).populate('processors');
  }).then((eaInstance) => {
    if (!eaInstance) {
      throw new Error('NOT_FOUND');
    }
    return Promise.map(eaInstance.processors, (eaProcessor) => {
      const type = require(`../ea-processor-types/${eaProcessor.type}`);
      return type.stop(eaProcessor).then(() => {
        return eaProcessor.remove();
      });
    }).then(() => {
      return eaInstance.remove();
    });
  }).then(() => {
    logger.info(`Terminated ${req.params.id}.`);
    res.status(204).send();
  }).catch((error) => {
    next(error);
  });
};

module.exports = {
  getEaInstances,
  launchEaInstance,
  terminateEaInstance
}
