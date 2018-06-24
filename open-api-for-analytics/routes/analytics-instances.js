const express = require('express');

const blueprint = require('../blueprints/analytics-instances');
const lift = require('../middlewares/lift-http');
const method = require('../core/methods/analytics-instances');
const respond = require('../middlewares/respond');
const validate = require('../middlewares/validate');

const router = express.Router({ mergeParams: true });

/**
 * @api {post} /analytics-instances?edgeGatewayReferenceID=:edgeGatewayReferenceID Create analytics instance
 * @apiName CreateAnalyticsInstance
 * @apiDescription Creates an analytics instance.
 * @apiGroup ANALYTICS INSTANCES
 *
 * @apiParam {String} [edgeGatewayReferenceID] The edge gateway where to create the analytics instance.
 * @apiParam {String} name The name of the analytics instance.
 * @apiParam {String} [description] The description of the analytics instance.
 * @apiParam {Object[]} analyticsProcessors.apm The analytics processors in the analytics instance.
 * @apiParam {String} [analyticsProcessors.apm.name] The name of the analytics processor.
 * @apiParam {String} [analyticsProcessors.apm.description] The description of the analytics processor.
 * @apiParam {String} analyticsProcessors.apm.analyticsProcessorDefinitionReferenceID The analytics processor definition that the analytics processor is based on.
 * @apiParam {Object[]} [analyticsProcessors.apm.parameters.parameter] The values for any parameters that the data interface of the data source definition of the data source has.
 * @apiParam {String} analyticsProcessors.apm.parameters.parameter.key The name of the parameter.
 * @apiParam {String} analyticsProcessors.apm.parameters.parameter.value The value of the parameter.
 * @apiParam {Object[]} analyticsProcessors.apm.dataSources.dataSource The data sources where the analytics processor gets its data from.
 * @apiParam {String} analyticsProcessors.apm.dataSources.dataSource.dataSourceManifestReferenceID The data source.
 * @apiParam {String} analyticsProcessors.apm.dataSink.dataSourceManifestReferenceID The data sink where the analytics processor puts its data.
 * @apiParamExample {json} Request
 *   {
 *     "name": "Heat detector",
 *     "analyticsProcessors": {
 *       "apm": [
 *         "analyticsProcessorDefinitionReferenceID": "5376c0aa-a93a-49e7-a5d9-16ff56d2e014",
 *         "dataSources": {
 *           "dataSource": [
 *             {
 *               "dataSourceManifestReferenceID": "d6393790-42eb-4b66-b4d7-a3ec32cc0953"
 *             }
 *           ]
 *         },
 *         "dataSink": {
 *           "dataSourceManifestReferenceID": "736b3b50-765f-4f27-9a70-e27c4b9c6541"
 *         }
 *       ]
 *     }
 *   }
 *
 * @apiSuccess {String} id The ID of the analytics instance.
 * @apiSuccess {String} name The name of the analytics instance.
 * @apiSuccess {String} [description] The description of the analytics instance.
 * @apiSuccess {Object[]} analyticsProcessors.apm The analytics processors in the analytics instance.
 * @apiSuccess {String} analyticsProcessors.apm.id The ID of the analytics processor.
 * @apiSuccess {String} [analyticsProcessors.apm.name] The name of the analytics processor.
 * @apiSuccess {String} [analyticsProcessors.apm.description] The description of the analytics processor.
 * @apiSuccess {String} analyticsProcessors.apm.analyticsProcessorDefinitionReferenceID The analytics processor definition that the analytics processor is based on.
 * @apiSuccess {Object[]} [analyticsProcessors.apm.parameters.parameter] The values for any parameters that the data interface of the data source definition of the data source has.
 * @apiSuccess {String} analyticsProcessors.apm.parameters.parameter.key The name of the parameter.
 * @apiSuccess {String} analyticsProcessors.apm.parameters.parameter.value The value of the parameter.
 * @apiSuccess {Object[]} analyticsProcessors.apm.dataSources.dataSource The data sources where the analytics processor gets its data from.
 * @apiSuccess {String} analyticsProcessors.apm.dataSources.dataSource.dataSourceManifestReferenceID The data source.
 * @apiSuccess {String} analyticsProcessors.apm.dataSink.dataSourceManifestReferenceID The data sink where the analytics processor puts its data.
 * @apiSuccess {String} [edgeGatewayReferenceID] The edge gateway where the analytics instance is created.
 * @apiSuccessExample Success
 *   HTTP/1.1 201 Created
 *   {
 *     "id": "abc59548-3805-476a-8992-977184effa90",
 *     "name": "Heat detector",
 *     "analyticsProcessors": {
 *       "apm": [
 *         "analyticsProcessorDefinitionReferenceID": "5376c0aa-a93a-49e7-a5d9-16ff56d2e014",
 *         "dataSources": {
 *           "dataSource": [
 *             {
 *               "dataSourceManifestReferenceID": "d6393790-42eb-4b66-b4d7-a3ec32cc0953"
 *             }
 *           ]
 *         },
 *         "dataSink": {
 *           "dataSourceManifestReferenceID": "736b3b50-765f-4f27-9a70-e27c4b9c6541"
 *         }
 *       ]
 *     },
 *     "edgeGatewayReferenceID": "d902fdab-6146-4ee3-91c3-a32f85f96305"
 *   }
 *
 * @apiError (Error 400) ANALYTICS_PROCESSOR_DEFINITION_NOT_FOUND The analytics processor definition was not found.
 * @apiError (Error 400) DATA_SINK_NOT_FOUND One or more of the data sinks was not found.
 * @apiError (Error 400) DATA_SOURCE_NOT_FOUND One or more of the data sources was not found.
 * @apiError (Error 400) DUPLICATE_PARAMETER_VALUE There are two or more values for the same parameter.
 * @apiError (Error 400) EDGE_GATEWAY_NOT_FOUND The edge gateway was not found.
 * @apiError (Error 400) MISSING_ANALYTICS_PROCESSOR_DEFINITION_REFERENCE_ID The analytics processor definition is missing.
 * @apiError (Error 400) MISSING_DATA_SINK The data sink is missing.
 * @apiError (Error 400) MISSING_DATA_SOURCES The data sources are missing.
 * @apiError (Error 400) MISSING_NAME The name is missing.
 * @apiError (Error 400) NAME_TAKEN The name is taken.
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "DATA_SINK_NOT_FOUND"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -H 'Content-Type: application/json' \
 *        -d '{ "name": "Heat detector", "analyticsProcessors": { "apm": [ "analyticsProcessorDefinitionReferenceID": "5376c0aa-a93a-49e7-a5d9-16ff56d2e014", "dataSources": { "dataSource": [ { "dataSourceManifestReferenceID": "d6393790-42eb-4b66-b4d7-a3ec32cc0953" } ] }, "dataSink": { "dataSourceManifestReferenceID": "736b3b50-765f-4f27-9a70-e27c4b9c6541" } ] } }' \
 *        -X POST http://localhost:9999/api/analytics-instances
 */
router.route('/').post(validate(blueprint.createAnalyticsInstance),
  lift(method.createAnalyticsInstance), respond);

/**
 * @api {put} /analytics-instances/:id/specification?edgeGatewayReferenceID=:edgeGatewayReferenceID Update analytics instance specification
 * @apiName UpdateAnalyticsInstanceSpecification
 * @apiDescription Updates the specification of an analytics instance.
 * @apiGroup ANALYTICS INSTANCES
 *
 * @apiParam {String} [edgeGatewayReferenceID] The edge gateway where to update the analytics instance.
 * @apiParam {String} id The ID of the analytics instance.
 * @apiParam {String} name The name of the analytics instance.
 * @apiParam {String} [description] The description of the analytics instance.
 * @apiParam {Object[]} analyticsProcessors.apm The analytics processors in the analytics instance.
 * @apiParam {String} [analyticsProcessors.apm.name] The name of the analytics processor.
 * @apiParam {String} [analyticsProcessors.apm.description] The description of the analytics processor.
 * @apiParam {String} analyticsProcessors.apm.analyticsProcessorDefinitionReferenceID The analytics processor definition that the analytics processor is based on.
 * @apiParam {Object[]} [analyticsProcessors.apm.parameters.parameter] The values for any parameters that the data interface of the data source definition of the data source has.
 * @apiParam {String} analyticsProcessors.apm.parameters.parameter.key The name of the parameter.
 * @apiParam {String} analyticsProcessors.apm.parameters.parameter.value The value of the parameter.
 * @apiParam {Object[]} analyticsProcessors.apm.dataSources.dataSource The data sources where the analytics processor gets its data from.
 * @apiParam {String} analyticsProcessors.apm.dataSink.dataSourceManifestReferenceID The data sink where the analytics processor puts its data.
 * @apiParamExample {json} Request
 *   {
 *     "name": "Heat detector",
 *     "analyticsProcessors": {
 *       "apm": [
 *         "analyticsProcessorDefinitionReferenceID": "5376c0aa-a93a-49e7-a5d9-16ff56d2e014",
 *         "dataSources": {
 *           "dataSource": [
 *             {
 *               "dataSourceManifestReferenceID": "d6393790-42eb-4b66-b4d7-a3ec32cc0953"
 *             }
 *           ]
 *         },
 *         "dataSink": {
 *           "dataSourceManifestReferenceID": "736b3b50-765f-4f27-9a70-e27c4b9c6541"
 *         }
 *       ]
 *     }
 *   }
 *
 * @apiSuccess {String} id The ID of the analytics instance.
 * @apiSuccess {String} name The name of the analytics instance.
 * @apiSuccess {String} [description] The description of the analytics instance.
 * @apiSuccess {Object[]} analyticsProcessors The analytics processors in the analytics instance.
 * @apiSuccess {String} analyticsProcessors.apm.id The ID of the analytics processor.
 * @apiSuccess {String} [analyticsProcessors.apm.name] The name of the analytics processor.
 * @apiSuccess {String} [analyticsProcessors.apm.description] The description of the analytics processor.
 * @apiSuccess {String} analyticsProcessors.apm.analyticsProcessorDefinitionReferenceID The analytics processor definition that the analytics processor is based on.
 * @apiSuccess {Object[]} [analyticsProcessors.apm.parameters.parameter] The values for any parameters that the data interface of the data source definition of the data source has.
 * @apiSuccess {String} analyticsProcessors.apm.parameters.parameter.key The name of the parameter.
 * @apiSuccess {String} analyticsProcessors.apm.parameters.parameter.value The value of the parameter.
 * @apiSuccess {Object[]} analyticsProcessors.apm.dataSources.dataSource The data sources where the analytics processor gets its data from.
 * @apiSuccess {String} analyticsProcessors.apm.dataSources.dataSource.dataSourceManifestReferenceID The data source.
 * @apiSuccess {String} analyticsProcessors.apm.dataSink.dataSourceManifestReferenceID The data sink where the analytics processor puts its data.
 * @apiSuccess {String} [edgeGatewayReferenceID] The edge gateway where the analytics instance is created.
 * @apiSuccessExample Success
 *   HTTP/1.1 200 OK
 *   {
 *     "id": "abc59548-3805-476a-8992-977184effa90",
 *     "name": "Heat detector",
 *     "analyticsProcessors": {
 *       "apm": [
 *         "analyticsProcessorDefinitionReferenceID": "5376c0aa-a93a-49e7-a5d9-16ff56d2e014",
 *         "dataSources": {
 *           "dataSource": [
 *             {
 *               "dataSourceManifestReferenceID": "d6393790-42eb-4b66-b4d7-a3ec32cc0953"
 *             }
 *           ]
 *         },
 *         "dataSink": {
 *           "dataSourceManifestReferenceID": "736b3b50-765f-4f27-9a70-e27c4b9c6541"
 *         }
 *       ]
 *     },
 *     "edgeGatewayReferenceID": "d902fdab-6146-4ee3-91c3-a32f85f96305"
 *   }
 *
 * @apiError (Error 404) ANALYTICS_INSTANCE_RUNNING The analytics instance is running.
 * @apiError (Error 400) ANALYTICS_PROCESSOR_DEFINITION_NOT_FOUND The analytics processor definition was not found.
 * @apiError (Error 400) DATA_SINK_NOT_FOUND One or more of the data sinks was not found.
 * @apiError (Error 400) DATA_SOURCE_NOT_FOUND One or more of the data sources was not found.
 * @apiError (Error 400) DUPLICATE_PARAMETER_VALUE There are two or more values for the same parameter.
 * @apiError (Error 400) EDGE_GATEWAY_NOT_FOUND The edge gateway was not found.
 * @apiError (Error 400) MISSING_ANALYTICS_PROCESSOR_DEFINITION_REFERENCE_ID The analytics processor definition is missing.
 * @apiError (Error 400) MISSING_DATA_SINK The data sink is missing.
 * @apiError (Error 400) MISSING_DATA_SOURCES The data sources are missing.
 * @apiError (Error 400) MISSING_NAME The name is missing.
 * @apiError (Error 400) NAME_TAKEN The name is taken.
 * @apiError (Error 404) ANALYTICS_INSTANCE_NOT_FOUND The analytics instance was not found.
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "ANALYTICS_INSTANCE_RUNNING"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -H 'Content-Type: application/json' \
 *        -d '{ "name": "Heat detector", "analyticsProcessors": { "apm": [ "analyticsProcessorDefinitionReferenceID": "5376c0aa-a93a-49e7-a5d9-16ff56d2e014", "dataSources": { "dataSource": [ { "dataSourceManifestReferenceID": "d6393790-42eb-4b66-b4d7-a3ec32cc0953" } ] }, "dataSink": { "dataSourceManifestReferenceID": "736b3b50-765f-4f27-9a70-e27c4b9c6541" } ] } }' \
 *        -X PUT http://localhost:9999/api/analytics-instances/abc59548-3805-476a-8992-977184effa90/specification
 */
router.route('/:id/specification').put(validate(blueprint.updateAnalyticsInstanceSpecification),
  lift(method.updateAnalyticsInstanceSpecification), respond);

/**
 * @api {delete} /analytics-instances/:id?edgeGatewayReferenceID=:edgeGatewayReferenceID Destroy analytics instance
 * @apiName DestroyAnalyticsInstance
 * @apiDescription Destroys an analytics instance.
 * @apiGroup ANALYTICS INSTANCES
 *
 * @apiParam {String} id The ID of the analytics instance.
 * @apiParam {String} [edgeGatewayReferenceID] The edge gateway where to delete the analytics instance from.
 *
 * @apiSuccessExample Success
 *   HTTP/1.1 204 No Content
 *
 * @apiError (Error 400) ANALYTICS_INSTANCE_EUNNING The analytics instance is running.
 * @apiError (Error 400) EDGE_GATEWAY_NOT_FOUND The edge gateway was not found.
 * @apiError (Error 404) ANALYTICS_INSTANCE_NOT_FOUND The analytics instance was not found.
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "ANALYTICS_INSTANCE_NOT_FOUND"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -X DELETE http://localhost:9999/api/analytics-instances/5376c0aa-a93a-49e7-a5d9-16ff56d2e014
 */
router.route('/:id').delete(validate(blueprint.destroyAnalyticsInstance),
  lift(method.destroyAnalyticsInstance), respond);

/**
 * @api {get} /analytics-instances/:id?edgeGatewayReferenceID=:edgeGatewayReferenceID Get analytics instance
 * @apiName GetAnalyticsInstance
 * @apiDescription Gets an analytics instance.
 * @apiGroup ANALYTICS INSTANCES
 *
 * @apiParam {String} id The ID of the analytics instance.
 * @apiParam {String} [edgeGatewayReferenceID] The edge gateway where to get the analytics instance from.
 *
 * @apiSuccess {String} id The ID of the analytics instance.
 * @apiSuccess {Object} specification The specification of the analytics instance.
 * @apiSuccess {String} specification.name The name of the analytics instance.
 * @apiSuccess {String} [specification.description] The description of the analytics instance.
 * @apiSuccess {Object[]} specification.analyticsProcessors.apm The analytics processors in the analytics instance.
 * @apiSuccess {String} specification.analyticsProcessors.apm.id The ID of the analytics processor.
 * @apiSuccess {String} [specification.analyticsProcessors.apm.name] The name of the analytics processor.
 * @apiSuccess {String} [specification.analyticsProcessors.apm.description] The description of the analytics processor.
 * @apiSuccess {String} specification.analyticsProcessors.apm.analyticsProcessorDefinitionReferenceID The analytics processor definition that the analytics processor is based on.
 * @apiSuccess {Object[]} [specification.analyticsProcessors.apm.parameters.parameter] The values for any parameters that the data interface of the data source definition of the data source has.
 * @apiSuccess {String} specification.analyticsProcessors.apm.parameters.parameter.key The name of the parameter.
 * @apiSuccess {String} specification.analyticsProcessors.apm.parameters.parameter.value The value of the parameter.
 * @apiSuccess {Object[]} specification.analyticsProcessors.apm.dataSources.dataSource The data sources where the analytics processor gets its data from.
 * @apiSuccess {String} specification.analyticsProcessors.apm.dataSources.dataSource.dataSourceManifestReferenceID The data source.
 * @apiSuccess {String} specification/analyticsProcessors.apm.dataSink.dataSourceManifestReferenceID The data sink where the analytics processor puts its data.
 * @apiSuccess {String} state The state of the analytics instance (FAILED, RUNNING, STOPPED).
 * @apiSuccess {String} [edgeGatewayReferenceID] The edge gateway where the analytics instance is created.
 * @apiSuccessExample Success
 *   HTTP/1.1 200 OK
 *   {
 *     "id": "abc59548-3805-476a-8992-977184effa90",
 *     "specification": {
 *       "name": "Heat detector",
 *       "analyticsProcessors": {
 *         "apm": [
 *           "analyticsProcessorDefinitionReferenceID": "5376c0aa-a93a-49e7-a5d9-16ff56d2e014",
 *           "dataSources": {
 *             "dataSource": [
 *               {
 *                 "dataSourceManifestReferenceID": "d6393790-42eb-4b66-b4d7-a3ec32cc0953"
 *               }
 *             ]
 *           },
 *           "dataSink": {
 *             "dataSourceManifestReferenceID": "736b3b50-765f-4f27-9a70-e27c4b9c6541"
 *           }
 *         ]
 *       }
 *     },
 *     "state": "STOPPED",
 *     "edgeGatewayReferenceID": "d902fdab-6146-4ee3-91c3-a32f85f96305"
 *   }
 *
 * @apiError (Error 400) EDGE_GATEWAY_NOT_FOUND The edge gateway was not found.
 * @apiError (Error 404) ANALYTICS_INSTANCE_NOT_FOUND The analytics instance was not found.
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "ANALYTICS_INSTANCE_NOT_FOUND"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -X GET http://localhost:9999/api/analytics-instances/abc59548-3805-476a-8992-977184effa90
 */
router.route('/:id').get(validate(blueprint.getAnalyticsInstance),
  lift(method.getAnalyticsInstance), respond);

/**
 * @api {get} /analytics-instances/:id/specification?edgeGatewayReferenceID=:edgeGatewayReferenceID Get analytics instance specification
 * @apiName GetAnalyticsInstanceSpecification
 * @apiDescription Gets the specification of an analytics instance.
 * @apiGroup ANALYTICS INSTANCES
 *
 * @apiParam {String} id The ID of the analytics instance.
 * @apiParam {String} [edgeGatewayReferenceID] The edge gateway where to get the analytics instance specification from.
 *
 * @apiSuccess {String} id The ID of the analytics instance.
 * @apiSuccess {String} name The name of the analytics instance.
 * @apiSuccess {String} [description] The description of the analytics instance.
 * @apiSuccess {Object[]} analyticsProcessors.apm The analytics processors in the analytics instance.
 * @apiSuccess {String} analyticsProcessors.apm.id The ID of the analytics processor.
 * @apiSuccess {String} [analyticsProcessors.apm.name] The name of the analytics processor.
 * @apiSuccess {String} [analyticsProcessors.apm.description] The description of the analytics processor.
 * @apiSuccess {String} analyticsProcessors.apm.analyticsProcessorDefinitionReferenceID The analytics processor definition that the analytics processor is based on.
 * @apiSuccess {Object[]} [analyticsProcessors.apm.parameters.parameter] The values for any parameters that the data interface of the data source definition of the data source has.
 * @apiSuccess {String} analyticsProcessors.apm.parameters.parameter.key The name of the parameter.
 * @apiSuccess {String} analyticsProcessors.apm.parameters.parameter.value The value of the parameter.
 * @apiSuccess {Object[]} analyticsProcessors.apm.dataSources.dataSource The data sources where the analytics processor gets its data from.
 * @apiSuccess {String} analyticsProcessors.apm.dataSources.dataSource.dataSourceManifestReferenceID The data source.
 * @apiSuccess {String} analyticsProcessors.apm.dataSink.dataSourceManifestReferenceID The data sink where the analytics processor puts its data.
 * @apiSuccess {String} [edgeGatewayReferenceID] The edge gateway where the analytics instance is created.
 * @apiSuccessExample Success
 *   HTTP/1.1 200 OK
 *   {
 *     "id": "abc59548-3805-476a-8992-977184effa90",
 *     "name": "Heat detector",
 *     "analyticsProcessors": {
 *       "apm": [
 *         "analyticsProcessorDefinitionReferenceID": "5376c0aa-a93a-49e7-a5d9-16ff56d2e014",
 *         "dataSources": {
 *           "dataSource": [
 *             {
 *               "dataSourceManifestReferenceID": "d6393790-42eb-4b66-b4d7-a3ec32cc0953"
 *             }
 *           ]
 *         },
 *         "dataSink": {
 *           "dataSourceManifestReferenceID": "736b3b50-765f-4f27-9a70-e27c4b9c6541"
 *         }
 *       ]
 *     },
 *     "edgeGatewayReferenceID": "d902fdab-6146-4ee3-91c3-a32f85f96305"
 *   }
 *
 * @apiError (Error 400) EDGE_GATEWAY_NOT_FOUND The edge gateway was not found.
 * @apiError (Error 404) ANALYTICS_INSTANCE_NOT_FOUND The analytics instance was not found.
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "ANALYTICS_INSTANCE_NOT_FOUND"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -X GET http://localhost:9999/api/analytics-instances/abc59548-3805-476a-8992-977184effa90/specification
 */
router.route('/:id/specification').get(validate(blueprint.getAnalyticsInstanceSpecification),
  lift(method.getAnalyticsInstanceSpecification), respond);

/**
 * @api {get} /analytics-instances/:id/state?edgeGatewayReferenceID=:edgeGatewayReferenceID Get analytics instance state
 * @apiName GetAnalyticsInstanceState
 * @apiDescription Gets the state of an analytics instance.
 * @apiGroup ANALYTICS INSTANCES
 *
 * @apiParam {String} id The ID of the analytics instance.
 * @apiParam {String} [edgeGatewayReferenceID] The edge gateway where to get the analytics instance state from.
 *
 * @apiSuccess {String} id The ID of the analytics instance.
 * @apiSuccess {String} state The state of the analytics instance (FAILED, RUNNING, STOPPED).
 * @apiSuccess {String} [edgeGatewayReferenceID] The edge gateway where the analytics instance is created.
 * @apiSuccessExample Success
 *   HTTP/1.1 200 OK
 *   {
 *     "id": "abc59548-3805-476a-8992-977184effa90",
 *     "state": "STOPPED"
 *   }
 *
 * @apiError (Error 400) EDGE_GATEWAY_NOT_FOUND The edge gateway was not found.
 * @apiError (Error 404) ANALYTICS_INSTANCE_NOT_FOUND The analytics instance was not found.
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "ANALYTICS_INSTANCE_NOT_FOUND"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -X GET http://localhost:9999/api/analytics-instances/abc59548-3805-476a-8992-977184effa90/state
 */
router.route('/:id/state').get(validate(blueprint.getAnalyticsInstanceState),
  lift(method.getAnalyticsInstanceState), respond);

/**
 * @api {post} /analytics-instances/discover?edgeGatewayReferenceID=:edgeGatewayReferenceID Discover analytics instances
 * @apiName DiscoverAnalyticsInstances
 * @apiDescription Discovers analytics instances.
 * @apiGroup ANALYTICS INSTANCES
 *
 * @apiParam {String} [id] The ID of the analytics instance.
 * @apiParam {String} [name] The name of the analytics instance.
 * @apiParam {String} [edgeGatewayReferenceID] The edge gateway where to discover analytics instances.
 * @apiParamExample {json} Request
 *   {
 *   }
 *
 * @apiSuccess {String} analyticsInstances.id The ID of the analytics instance.
 * @apiSuccess {Object} analyticsInstances.specification The specification of the analytics instance.
 * @apiSuccess {String} analyticsInstances.specification.name The name of the analytics instance.
 * @apiSuccess {String} [analyticsInstances.specification.description] The description of the analytics instance.
 * @apiSuccess {Object[]} analyticsInstances.specification.analyticsProcessors.apm The analytics processors in the analytics instance.
 * @apiSuccess {String} analyticsInstances.specification.analyticsProcessors.apm.id The ID of the analytics processor.
 * @apiSuccess {String} [analyticsInstances.specification.analyticsProcessors.apm.name] The name of the analytics processor.
 * @apiSuccess {String} [analyticsInstances.specification.analyticsProcessors.apm.description] The description of the analytics processor.
 * @apiSuccess {String} analyticsInstances.specification.analyticsProcessors.apm.analyticsProcessorDefinitionReferenceID The analytics processor definition that the analytics processor is based on.
 * @apiSuccess {Object[]} [analyticsInstances.specification.analyticsProcessors.apm.parameters.parameter] The values for any parameters that the data interface of the data source definition of the data source has.
 * @apiSuccess {String} analyticsInstances.specification.analyticsProcessors.apm.parameters.parameter.key The name of the parameter.
 * @apiSuccess {String} analyticsInstances.specification.analyticsProcessors.apm.parameters.parameter.value The value of the parameter.
 * @apiSuccess {Object[]} analyticsInstances.specification.analyticsProcessors.apm.dataSources.dataSource The data sources where the analytics processor gets its data from.
 * @apiSuccess {String} analyticsInstances.specification.analyticsProcessors.apm.dataSources.dataSource.dataSourceManifestReferenceID The data source.
 * @apiSuccess {Object} analyticsInstances.specification.analyticsProcessors.apm.dataSink.dataSourceManifestReferenceID The data sink where the analytics processor puts its data.
 * @apiSuccess {String} analyticsInstances.state The state of the analytics instance (FAILED, RUNNING, STOPPED).
 * @apiSuccess {String} [analyticsInstances.edgeGatewayReferenceID] The edge gateway where the analytics instance is created.
 * @apiSuccessExample Success
 *   HTTP/1.1 200 OK
 *   {
 *     "analyticsInstances" : [
 *       {
 *         "id": "abc59548-3805-476a-8992-977184effa90",
 *         "specification": {
 *           "name": "Heat detector",
 *           "analyticsProcessors": {
 *             "apm": [
 *               "analyticsProcessorDefinitionReferenceID": "5376c0aa-a93a-49e7-a5d9-16ff56d2e014",
 *               "dataSources": {
 *                 "dataSource": [
 *                   {
 *                     "dataSourceManifestReferenceID": "d6393790-42eb-4b66-b4d7-a3ec32cc0953"
 *                   }
 *                 ]
 *               },
 *               "dataSink": {
 *                 "dataSourceManifestReferenceID": "736b3b50-765f-4f27-9a70-e27c4b9c6541"
 *               }
 *             ]
 *           }
 *         },
 *         "state": "STOPPED",
 *         "edgeGatewayReferenceID": "d902fdab-6146-4ee3-91c3-a32f85f96305"
 *       }
 *     ]
 *   }
 *
 * @apiError (Error 400) EDGE_GATEWAY_NOT_FOUND The edge gateway was not found.
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "FAILED"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -H 'Content-Type: application/json' \
 *        -d '{ "processorType": "average" }' \
 *        -X POST http://localhost:9999/api/analytics-instances/discover
 */
router.route('/discover').post(validate(blueprint.discoverAnalyticsInstances),
  lift(method.discoverAnalyticsInstances), respond);

/**
 * @api {post} /analytics-instances/:id/start?edgeGatewayReferenceID=:edgeGatewayReferenceID Start analytics instance
 * @apiName StartAnalyticsInstance
 * @apiDescription Starts an analytics instance.
 * @apiGroup ANALYTICS INSTANCES
 *
 * @apiParam {String} id The ID of the analytics instance.
 * @apiParam {String} [edgeGatewayReferenceID] The edge gateway where to start the analytics instance.
 *
 * @apiSuccessExample Success
 *   HTTP/1.1 204 No Content
 *
 * @apiError (Error 400) ANALYTICS_INSTANCE_RUNNING The analytics instance is already running.
 * @apiError (Error 400) EDGE_GATEWAY_NOT_FOUND The edge gateway was not found.
 * @apiError (Error 404) ANALYTICS_INSTANCE_NOT_FOUND The analytics instance was not found.
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "ANALYTICS_INSTANCE_NOT_FOUND"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -X POST http://localhost:9999/api/analytics-instances/5376c0aa-a93a-49e7-a5d9-16ff56d2e014/start
 */
router.route('/:id/start').post(validate(blueprint.startAnalyticsInstance),
  lift(method.startAnalyticsInstance), respond);

/**
 * @api {post} /analytics-instances/:id/stop?edgeGatewayReferenceID=:edgeGatewayReferenceID Stop analytics instance
 * @apiName StopAnalyticsInstance
 * @apiDescription Stops an analytics instance.
 * @apiGroup ANALYTICS INSTANCES
 *
 * @apiParam {String} id The ID of the analytics instance.
 * @apiParam {String} [edgeGatewayReferenceID] The edge gateway where to stop the analytics instance.
 *
 * @apiSuccessExample Success
 *   HTTP/1.1 204 No Content
 *
 * @apiError (Error 400) ANALYTICS_INSTANCE_NOT_RUNNING The analytics instance is not running.
 * @apiError (Error 400) EDGE_GATEWAY_NOT_FOUND The edge gateway was not found.
 * @apiError (Error 404) ANALYTICS_INSTANCE_NOT_FOUND The analytics instance was not found.
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "ANALYTICS_INSTANCE_NOT_FOUND"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -X POST http://localhost:9999/api/analytics-instances/5376c0aa-a93a-49e7-a5d9-16ff56d2e014/stop
 */
router.route('/:id/stop').post(validate(blueprint.stopAnalyticsInstance),
  lift(method.stopAnalyticsInstance), respond);

module.exports = router;
