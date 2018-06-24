const Promise = require('bluebird');

const AnalyticsManifest = require('../../models/analytics-manifest');
const chisels = require('../../common/chisels');
const DataSourceManifest = require('../../models/data-source-manifest');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('ANALYTICS-INSTANCES');
const modelDiscoverer = require('../../workers/model-discoverer');

// Validates an analytics manifest.
const validateAnalyticsManifest = (analyticsManifest) => {
  return Promise.try(() => {
    // The name must be unique among all analytics instances.
    return AnalyticsManifest.count({
      _id: {
        $ne: analyticsManifest._id
      },
      name: analyticsManifest.name
    }).then((exists) => {
      if (exists) {
        logger.error(`Name ${ analyticsManifest.name } is taken.`);
        throw new errors.BadRequestError('NAME_TAKEN');
      }
      return null;
    });
  }).then(() => {
    // All analytics processor definitions must exist.
    return Promise.each(analyticsManifest.analyticsProcessors.apm.map((p) => {
      return p.analyticsProcessorDefinitionReferenceID;
    }), (id) => {
      return modelDiscoverer.discoverAnalyticsProcessorDefinitions({
        id
      }).then((analyticsProcessorDefinitions) => {
        if (!analyticsProcessorDefinitions.length) {
          logger.error(`Analytics processor definition ${ id } does not exist.`);
          throw new errors.BadRequestError('ANALYTICS_PROCESSOR_DEFINITION_NOT_FOUND');
        }
      });
    });
  }).then(() => {
    // All data source manifests must exist.
    return Promise.each(analyticsManifest.analyticsProcessors.apm.map((p) => {
      return p.dataSources.dataSource.map((ds) => { return ds.dataSourceManifestReferenceID; });
    }).reduce((acc, ids) => {
      return acc.concat(ids);
    }, []), (id) => {
      return DataSourceManifest.findById(id).then((dataSourceManifest) => {
        if (!dataSourceManifest) {
          logger.error(`Data source ${ id } does not exist.`);
          throw new errors.BadRequestError('DATA_SOURCE_NOT_FOUND');
        }
      });
    });
  }).then(() => {
    // The data sink manifest must exist.
    return Promise.each(analyticsManifest.analyticsProcessors.apm.map((p) => {
      return p.dataSink.dataSourceManifestReferenceID;
    }), (id) => {
      return DataSourceManifest.findById(id).then((dataSourceManifest) => {
        if (!dataSourceManifest) {
          logger.error(`Data sink ${ id } does not exist.`);
          throw new errors.BadRequestError('DATA_SINK_NOT_FOUND');
        }
      });
    });
  }).then(() => {
    // All parameters must have unique names.
    return Promise.each(analyticsManifest.analyticsProcessors.apm, (p) => {
      const parameters = p.parameters ? p.parameters.parameter || [] : [];
      const nparameters = parameters.length;
      const nnames = chisels.distinct(parameters.map((p) => { return p.key; })).length;
      if (nnames < nparameters) {
        logger.error('There are more than one values for the same parameter.');
        throw new errors.BadRequestError('DUPLICATE_PARAMETER_VALUE');
      }
    });
  }).then(() => {
    return analyticsManifest;
  });
};

module.exports = {
  validateAnalyticsManifest
};
