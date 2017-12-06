const Promise = require('bluebird');

const EaProcessorType = require('../models/ea-processor-type');
const logger = require('../logger');

const getEaProcessorTypes = (req, res, next) => {
  return Promise.try(() => {
    return EaProcessorType.find({});
  }).then((eaProcessorTypes) => {
    res.status(200).json({ eaProcessorTypes });
  }).catch((error) => {
    next(error);
  });
};

const registerEaProcessorType = (req, res, next) => {
  return Promise.try(() => {
    return EaProcessorType.findOne({ name: req.body.name }).then((eaProcessorType) => {
      if (eaProcessorType) {
        throw new Error('BAD_REQUEST');
      }
    });
  }).then(() => {
    const eaProcessorType = new EaProcessorType(req.body);
    return eaProcessorType.save();
  }).then((eaProcessorType) => {
    res.status(201).json({ eaProcessorType });
  }).catch((error) => {
    next(error);
  });
};

const unregisterEaProcessorType = (req, res, next) => {
  return Promise.try(() => {
    return EaProcessorType.findOne({ name: req.params.name });
  }).then((eaProcessorType) => {
    if (!eaProcessorType) {
      throw new Error('NOT_FOUND');
    }
    return eaProcessorType.remove();
  }).then(() => {
    res.status(204).send();
  }).catch((error) => {
    next(error);
  });
};

module.exports = {
  getEaProcessorTypes,
  registerEaProcessorType,
  unregisterEaProcessorType
};
