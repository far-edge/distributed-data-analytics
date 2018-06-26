const Promise = require('bluebird');
const request = require('request-promise');
const rerrors = require('request-promise/errors');

const DataSourceManifest = require('../../models/data-source-manifest');
const EdgeGateway = require('../../models/edge-gateway');
const errors = require('../../common/errors');
const logger = require('../../common/loggers').get('DATA-SOURCES');

// Discovers globally scoped data sources.
const _discoverGlobalDataSources = (input) => {
  logger.debug('Discover data sources in the global scope.');
  return Promise.try(() => {
    if (input.edgeGatewayReferenceID) {
      return [];
    }
    // Find the data source manifests that match the given criteria.
    return DataSourceManifest.find({
      ...(input.id ? { _id: input.id } : { }),
      ...(input.name ? { name: input.name } : { }),
      ...(input.dataSourceDefinitionReferenceID ? {
        dataSourceDefinitionReferenceID: input.dataSourceDefinitionReferenceID
      } : { })
    });
  }).then((dataSourceManifests) => {
    logger.debug('Discovered data sources in the global scope.');
    return dataSourceManifests;
  }).catch((error) => {
    logger.error('Failed to discover data sources in the global scope.', error);
    throw error;
  });
};

// Discovers locally scoped data sources.
const _discoverLocalDataSources = (input) => {
  logger.debug('Discover data sources in the local scopes.');
  return Promise.try(() => {
    // Find either all edge gateways or a specific one.
    return EdgeGateway.find({
      ...(input.edgeGatewayReferenceID ? { _id: input.edgeGatewayReferenceID } : { })
    });
  }).then((edgeGateways) => {
    // The specific edge gateway (if any) does not exist.
    if (input.edgeGatewayReferenceID && !edgeGateways.length) {
      logger.error(`Edge gateway ${ input.id } does not exist.`);
      throw new errors.BadRequestError('EDGE_GATEWAY_NOT_FOUND');
    }
    // Forward the request to all edge gateways.
    return Promise.map(edgeGateways, (edgeGateway) => {
      logger.debug(`Discover data sources in edge gateway ${ edgeGateway._id } local scope.`);
      return request({
        method: 'POST',
        uri: `${ edgeGateway.dataRouterAndPreprocessorBaseURL }/data-sources/discover`,
        body: {
          ...(input.id ? { id: input.id } : { }),
          ...(input.name ? { name: input.name } : { }),
          ...(input.dataSourceDefinitionReferenceID ? {
            dataSourceDefinitionReferenceID: input.dataSourceDefinitionReferenceID
          } : { })
        },
        json: true,
        resolveWithFullResponse: true,
        simple: true
      }).catch(rerrors.StatusCodeError, (reason) => {
        if (reason.statusCode === 400) {
          throw new errors.BadRequestError(reason.response.body.error);
        }
        throw new Error(reason.response.body.error);
      }).then((response) => {
        // Fill in the edge gateway.
        return response.body.dataSources.map((dataSourceManifest) => {
          return { ...dataSourceManifest, edgeGatewayReferenceID: edgeGateway._id };
        });
      }).then((dataSourceManifests) => {
        logger.debug(`Discovered data sources in edge gateway ${ edgeGateway._id } local scope.`);
        return dataSourceManifests;
      }).catch((error) => {
        logger.error('Failed to discover data sources in edge gateway ${ edgeGateway._id } local scope.', error);
        return [];
      });
    }).then((dataSourceManifests) => {
      return dataSourceManifests.reduce((acc, dsms) => { return acc.concat(dsms); }, []);
    });
  }).then((dataSourceManifests) => {
    logger.debug('Discovered data sources in the local scopes.');
    return dataSourceManifests;
  }).catch((error) => {
    logger.error('Failed to discover data sources in the local scopes.', error);
    throw error;
  });
};

// Discovers data sources.
const discoverDataSources = (input) => {
  logger.debug('Discover data sources.');
  return Promise.all([
    // Discover the locally scoped data sources that match the given criteria.
    _discoverLocalDataSources(input),
    // Discover the globally scoped data sources that match the given criteria.
    _discoverGlobalDataSources(input)
  ]).spread((local, global) => {
    return local.concat(global);
  }).then((dataSourceManifests) => {
    logger.debug('Discovered data sources.');
    return { dataSources: dataSourceManifests };
  }).catch((error) => {
    logger.error('Failed to discover data sources.', error);
    throw error;
  });
};

module.exports = discoverDataSources;
