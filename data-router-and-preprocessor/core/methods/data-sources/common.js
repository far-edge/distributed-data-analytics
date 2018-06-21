const Promise = require('bluebird');

const chisels = require('../../common/chisels');
const DataSourceManifest = require('../../models/data-source-manifest');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('DATA-SOURCES');
const modelDiscoverer = require('../../workers/model-discoverer');

// Validates a data source manifest.
const validateDataSourceManifest = (dataSourceManifest) => {
  return Promise.try(() => {
    // The name must be unique among all data sources.
    return DataSourceManifest.count({
      _id: {
        $ne: dataSourceManifest._id
      },
      name: dataSourceManifest.name
    }).then((exists) => {
      if (exists) {
        logger.error(`Name ${ dataSourceManifest.name } is taken.`);
        throw new errors.BadRequestError('NAME_TAKEN');
      }
      return null;
    });
  }).then(() => {
    // The data source definition must exist.
    const id = dataSourceManifest.dataSourceDefinitionReferenceID;
    return modelDiscoverer.discoverDataSourceDefinitions({ id }).then((dataSourceDefinitions) => {
      if (!dataSourceDefinitions.length) {
        logger.error(`Data source defintion ${ id } does not exist.`);
        throw new errors.BadRequestError('DATA_SOURCE_DEFINITION_NOT_FOUND');
      }
    });
  }).then(() => {
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
