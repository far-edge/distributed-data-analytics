const Joi = require('joi');

const customJoi = Joi.extend([
  {
    base: Joi.string().guid({ version: [ 'uuidv4' ] }),
    name: 'id'
  }
]);

module.exports = customJoi;
