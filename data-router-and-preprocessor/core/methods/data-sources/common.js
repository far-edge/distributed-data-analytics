const Promise = require('bluebird');

const chisels = require('../../common/chisels');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('DATA-SOURCE-MANIFESTS');

// Validates a data source manifest.
const validateDataSourceManifest = (dataSourceManifest) => {
  return Promise.try(() => {
    // All parameters must have unique names.
    const parameters = dataSourceManifest.dataSourceDefinitionInterfaceParameters ?
      dataSourceManifest.dataSourceDefinitionInterfaceParameters.parameter || [] : [];
    const nparameters = parameters.length;
    const nnames = chisels.distinct(parameters.map((p) => { return p.key; })).length;
    if (nnames < nparameters) {
      logger.error('There are more than one values for the same parameter.');
      throw new errors.BadRequestError('DUPLICATE_PARAMETER_VALUE');
    }
    return null;
  }).then(() => {
    return dataSourceManifest;
  });
};

module.exports = {
  validateDataSourceManifest
};
