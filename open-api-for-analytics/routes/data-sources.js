const express = require('express');

const blueprint = require('../blueprints/data-sources');
const lift = require('../middlewares/lift-http');
const method = require('../core/methods/data-sources');
const respond = require('../middlewares/respond');
const validate = require('../middlewares/validate');

const router = express.Router({ mergeParams: true });

/**
 * @api {post} /data-sources?edgeGatewayReferenceID=:edgeGatewayReferenceID Register data source
 * @apiName RegisterDataSource
 * @apiDescription Registers a data source.
 * @apiGroup DATA SOURCES
 *
 * @apiParam {String} [edgeGatewayReferenceID] The edge gateway where to register the data source.
 * @apiParam {String} name The name of the data source.
 * @apiParam {String} [description] The description of the data source.
 * @apiParam {String} macAddress The MAC address of the device that the data source is connected with.
 * @apiParam {String} dataSourceDefinitionReferenceID The data source definition that the data source is based on.
 * @apiParam {Object[]} [dataSourceDefinitionInterfaceParameters.parameter] The values for any parameters that the data interface of the data source definition of the data source has.
 * @apiParam {String} dataSourceDefinitionInterfaceParameters.parameter.key The name of the parameter.
 * @apiParam {String} dataSourceDefinitionInterfaceParameters.parameter.value The value of the parameter.
 * @apiParamExample {json} Request
 *   {
 *     "name": "Machine #1 temperature in JSON over MQTT",
 *     "description": "The temperature for machine #1 in JSON format over MQTT.",
 *     "macAddress": "B7-7A-7C-5C-E7-FC",
 *     "dataSourceDefinitionReferenceID": "a89524a9-e8f7-455c-857b-0380ff308412",
 *     "dataSourceDefinitionInterfaceParameters": {
 *       "parameter": [
 *         {
 *           "key": "host",
 *           "value": "localhost"
 *         },
 *         {
 *           "key": "port",
 *           "value": 1883
 *         }
 *       ]
 *     }
 *   }
 *
 * @apiSuccess {String} id The ID of the data source.
 * @apiSuccess {String} name The name of the data source.
 * @apiSuccess {String} [description] The description of the data source.
 * @apiSuccess {String} macAddress The MAC address of the device that the data source is connected with.
 * @apiSuccess {String} dataSourceDefinitionReferenceID The data source definition that the data source is based on.
 * @apiSuccess {Object[]} [dataSourceDefinitionInterfaceParameters.parameter] The values for any parameters that the data interface of the data source definition of the
 * @apiSuccess {String} dataSourceDefinitionInterfaceParameters.parameter.key The name of the parameter.
 * @apiSuccess {String} dataSourceDefinitionInterfaceParameters.parameter.value The value of the parameter.
 * @apiSuccess {String} [edgeGatewayReferenceID] The edge gateway where the data source is registered.
 * @apiSuccessExample Success
 *   HTTP/1.1 201 Created
 *   {
 *     "id": "abc59548-3805-476a-8992-977184effa90",
 *     "name": "Machine #1 temperature in JSON over MQTT",
 *     "description": "The temperature for machine #1 in JSON format over MQTT.",
 *     "macAddress": "B7-7A-7C-5C-E7-FC",
 *     "dataSourceDefinitionReferenceID": "a89524a9-e8f7-455c-857b-0380ff308412",
 *     "dataSourceDefinitionInterfaceParameters": {
 *       "parameter": [
 *         {
 *           "key": "host",
 *           "value": "localhost"
 *         },
 *         {
 *           "key": "port",
 *           "value": 1883
 *         }
 *       ]
 *     },
 *     "edgeGatewayReferenceID": "d902fdab-6146-4ee3-91c3-a32f85f96305"
 *   }
 *
 * @apiError (Error 400) DATA_SOURCE_DEFINITION_NOT_FOUND The data source definition was not found.
 * @apiError (Error 400) DUPLICATE_PARAMETER_VALUE There are two or more values for the same parameter.
 * @apiError (Error 400) EDGE_GATEWAY_NOT_FOUND The edge gateway was not found.
 * @apiError (Error 400) MISSING_MAC_ADDRESS The MAC address is missing.
 * @apiError (Error 400) MISSING_NAME The name is missing.
 * @apiError (Error 400) MISSING_DATA_SOURCE_DEFINITION_REFERENCE_ID The data source definition is missing.
 * @apiError (Error 400) NAME_TAKEN The name is taken.
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "MISSING_DATA_SOURCE_DEFINITION_REFERENCE_ID"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -H 'Content-Type: application/json' \
 *        -d '{ "name": "Machine #1 temperature in JSON over MQTT, "description": "The temperature for machine #1 in JSON format over MQTT.", "macAddress": "B7-7A-7C-5C-E7-FC", "dataSourceDefinitionReferenceID": "a89524a9-e8f7-455c-857b-0380ff308412", "dataSourceDefinitionInterfaceParameters": { "parameter": [ { "key": "host", "value": "localhost" }, { "key": "port", "value": 1883 } ] } }' \
 *        -X POST http://localhost:7777/api/data-sources
 */
router.route('/').post(validate(blueprint.registerDataSource), lift(method.registerDataSource),
  respond);

/**
 * @api {delete} /data-sources/:id?edgeGatewayReferenceID=:edgeGatewayReferenceID Unregister data source
 * @apiName UnregisterDataSource
 * @apiDescription Unregisters a data source.
 * @apiGroup DATA SOURCES
 *
 * @apiParam {String} id The ID of the data source.
 * @apiParam {String} [edgeGatewayReferenceID] The edge gateway where to unregister the data source from.
 *
 * @apiSuccessExample Success
 *   HTTP/1.1 204 No Content
 *
 * @apiError (Error 404) DATA_SOURCE_NOT_FOUND The data source was not found.
 * @apiError (Error 400) EDGE_GATEWAY_NOT_FOUND The edge gateway was not found.
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "DATA_SOURCE_NOT_FOUND"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -X DELETE http://localhost:7777/api/data-sources/abc59548-3805-476a-8992-977184effa90
 */
router.route('/:id').delete(validate(blueprint.unregisterDataSource),
  lift(method.unregisterDataSource), respond);

/**
 * @api {post} /data-sources/discover?edgeGatewayReferenceID=:edgeGatewayReferenceID Discover data sources
 * @apiName DiscoverDataSources
 * @apiDescription Discovers data sources.
 * @apiGroup DATA SOURCES
 *
 * @apiParam {String} [edgeGatewayReferenceID] The edge gateway where to discover data sources.
 * @apiParam {String} [id] The ID of the data source.
 * @apiParam {String} [name] The name of the data source.
 * @apiParam {String} [dataSourceDefinitionReferenceID] The data source definition of the data source.
 * @apiParamExample {json} Request
 *   {
 *     "dataSourceDefinitionReferenceID": "a89524a9-e8f7-455c-857b-0380ff308412"
 *   }
 *
 * @apiSuccess {Object[]} dataSources The data sources that match the given criteria.
 * @apiSuccess {String} dataSources.id The ID of the data source.
 * @apiSuccess {String} dataSources.name The name of the data source.
 * @apiSuccess {String} [dataSources.description] The description of the data source.
 * @apiSuccess {String} dataSources.macAddress The MAC address of the device that the data source is connected with.
 * @apiSuccess {String} dataSources.dataSourceDefinitionReferenceID The data source definition that the data source is based on.
 * @apiSuccess {Object[]} [dataSources.dataSourceDefinitionInterfaceParameters.parameter] The values for any parameters that the data interface of the data source definition of the data source has.
 * @apiSuccess {String} dataSources.dataSourceDefinitionInterfaceParameters.parameter.key The name of the parameter.
 * @apiSuccess {String} dataSources.dataSourceDefinitionInterfaceParameters.parameter.value The value of the parameter.
 * @apiSuccess {String} [edgeGatewayReferenceID] The edge gateway where the data source is registered.
 * @apiSuccessExample Success
 *   HTTP/1.1 200 OK
 *   {
 *     "dataSources": [
 *       "id": "abc59548-3805-476a-8992-977184effa90",
 *       "name": "Machine #1 temperature in JSON over MQTT",
 *       "description": "The temperature for machine #1 in JSON format over MQTT.",
 *       "macAddress": "B7-7A-7C-5C-E7-FC",
 *       "dataSourceDefinitionReferenceID": "a89524a9-e8f7-455c-857b-0380ff308412",
 *       "dataSourceDefinitionInterfaceParameters": {
 *         "parameter": [
 *           {
 *             "key": "host",
 *             "value": "localhost"
 *           },
 *           {
 *             "key": "port",
 *             "value": 1883
 *           }
 *         ]
 *       },
 *       "edgeGatewayReferenceID": "d902fdab-6146-4ee3-91c3-a32f85f96305"
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
 *        -d '{ "dataSourceDefinitionReferenceID": "a89524a9-e8f7-455c-857b-0380ff308412" }' \
 *        -X POST http://localhost:7777/api/data-sources/discover
 */
router.route('/discover').post(validate(blueprint.discoverDataSources),
  lift(method.discoverDataSources), respond);

module.exports = router;
