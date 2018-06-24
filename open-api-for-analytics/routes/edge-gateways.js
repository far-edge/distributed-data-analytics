const express = require('express');

const blueprint = require('../blueprints/edge-gateways');
const lift = require('../middlewares/lift-http');
const method = require('../core/methods/edge-gateways');
const respond = require('../middlewares/respond');
const validate = require('../middlewares/validate');

const router = express.Router({ mergeParams: true });

/**
 * @api {post} /edge-gateways Create edge gateway
 * @apiName CreateEdgeGateway
 * @apiDescription Creates an edge gateway.
 * @apiGroup EDGE GATEWAYS
 *
 * @apiParam {String} name The name of the edge gateway.
 * @apiParam {String} [description] The description of the edge gateway.
 * @apiParam {String} namespace The namespace of the edge gateway.
 * @apiParam {String} macAddress The MAC address of the edge gateway.
 * @apiParam {Object} [location] The location of the edge gateway.
 * @apiParam {Number} location.geoLocation The geographical location.
 * @apiParam {Object} location.geoLocation.latitude The latitude.
 * @apiParam {Number} location.geoLocation.longitude The longitude.
 * @apiParam {String} location.virtualLocation The virtual location.
 * @apiParam {String} dataRouterAndPreprocessorBaseURL The base URL to the data router and preprocessor of the edge gateway.
 * @apiParam {String} edgeAnalyticsEngineBaseURL The base URL to the edge analytics engine of the edge gateway.
 * @apiParam {String[]} [additionalInformation] Additional information about the edge gateway.
 * @apiParamExample {json} Request
 *   {
 *     "name": "Machine #1",
 *     "description": "Some machine.",
 *     "namespace": "machine1",
 *     "macAddress": "63-80-5F-E6-54-9D",
 *     "location": {
 *       "virtualLocation": "floor1"
 *     },
 *     "dataRouterAndPreprocessorBaseURL": "http://localhost:7777/api",
 *     "edgeAnalyticsEngineBaseURL": "http://localhost:9999/api"
 *   }
 *
 * @apiSuccess {String} id The ID of the edge gateway.
 * @apiSuccess {String} name The name of the edge gateway.
 * @apiSuccess {String} [description] The description of the edge gateway.
 * @apiSuccess {String} namespace The namespace of the edge gateway.
 * @apiSuccess {String} macAddress The MAC address of the edge gateway.
 * @apiSuccess {Object} [location] The location of the edge gateway.
 * @apiSuccess {Object} location.geoLocation.latitude The latitude.
 * @apiSuccess {Number} location.geoLocation.longitude The longitude.
 * @apiSuccess {Number} location.geoLocation The geographical location.
 * @apiSuccess {String} location.virtualLocation The virtual location.
 * @apiSuccess {String} dataRouterAndPreprocessorBaseURL The base URL to the data router and preprocessor of the edge gateway.
 * @apiSuccess {String} edgeAnalyticsEngineBaseURL The base URL to the edge analytics engine of the edge gateway.
 * @apiSuccess {String[]} [additionalInformation] Additional information about the edge gateway.
 * @apiSuccessExample Success
 *   HTTP/1.1 201 Created
 *   {
 *     "id": "d902fdab-6146-4ee3-91c3-a32f85f96305",
 *     "name": "Machine #1",
 *     "description": "Some machine.",
 *     "namespace": "machine1",
 *     "macAddress": "63-80-5F-E6-54-9D",
 *     "location": {
 *       "virtualLocation": "floor1"
 *     },
 *     "dataRouterAndPreprocessorBaseURL": "http://localhost:7777/api",
 *     "edgeAnalyticsEngineBaseURL": "http://localhost:9999/api"
 *   }
 *
 * @apiError (Error 400) MISSING_NAME The name is missing.
 * @apiError (Error 400) MISSING_NAMESPACE The namespace is missing.
 * @apiError (Error 400) MISSING_MAC_ADDRESS The MAC address is missing.
 * @apiError (Error 400) MISSING_MAC_ADDRESS The MAC address is missing.
 * @apiError (Error 400) MISSING_DATA_ROUTER_AND_PREPROCESSOR_BASE_URL The base URL to the data router and preprocessor is missing.
 * @apiError (Error 400) MISSING_EDGE_ANALYTICS_ENGINE_BASE_URL The base URL to the edge analytics engine is missing.
 * @apiError (Error 400) NAME_TAKEN The name is taken.
 * @apiError (Error 400) NAMESPACE_TAKEN The namespece is taken.
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "FAILED"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -H 'Content-Type: application/json' \
 *        -d '{ "name": "Machine #1", "description": "Some machine.", "namespace": "machine1", "macAddress": "63-80-5F-E6-54-9D", "location": { "virtualLocation": "floor1" }, "dataRouterAndPreprocessorBaseURL": "http://localhost:7777/api", "edgeAnalyticsEngineBaseURL": "http://localhost:9999/api" }' \
 *        -X POST http://localhost:6666/api/edge-gateways
 */
router.route('/').post(validate(blueprint.createEdgeGateway),
  lift(method.createEdgeGateway), respond);

/**
 * @api {put} /edge-gateways/:id Update edge gateway
 * @apiName UpdateEdgeGateway
 * @apiDescription Updates an edge gateway.
 * @apiGroup EDGE GATEWAYS
 *
 * @apiParam {String} id The ID of the edge gateway.
 * @apiParam {String} name The name of the edge gateway.
 * @apiParam {String} [description] The description of the edge gateway.
 * @apiParam {String} namespace The namespace of the edge gateway.
 * @apiParam {String} macAddress The MAC address of the edge gateway.
 * @apiParam {Object} [location] The location of the edge gateway.
 * @apiParam {Number} location.geoLocation The geographical location.
 * @apiParam {Object} location.geoLocation.latitude The latitude.
 * @apiParam {Number} location.geoLocation.longitude The longitude.
 * @apiParam {String} location.virtualLocation The virtual location.
 * @apiParam {String} dataRouterAndPreprocessorBaseURL The base URL to the data router and preprocessor of the edge gateway.
 * @apiParam {String} edgeAnalyticsEngineBaseURL The base URL to the edge analytics engine of the edge gateway.
 * @apiParam {String[]} [additionalInformation] Additional information about the edge gateway.
 * @apiParamExample {json} Request
 *   {
 *     "name": "Machine #1",
 *     "description": "Some machine.",
 *     "namespace": "machine1",
 *     "macAddress": "63-80-5F-E6-54-9D",
 *     "location": {
 *       "virtualLocation": "floor1"
 *     },
 *     "dataRouterAndPreprocessorBaseURL": "http://localhost:7777/api",
 *     "edgeAnalyticsEngineBaseURL": "http://localhost:9999/api"
 *   }
 *
 * @apiSuccess {String} id The ID of the edge gateway.
 * @apiSuccess {String} name The name of the edge gateway.
 * @apiSuccess {String} [description] The description of the edge gateway.
 * @apiSuccess {String} namespace The namespace of the edge gateway.
 * @apiSuccess {String} macAddress The MAC address of the edge gateway.
 * @apiSuccess {Object} [location] The location of the edge gateway.
 * @apiSuccess {Object} location.geoLocation.latitude The latitude.
 * @apiSuccess {Number} location.geoLocation.longitude The longitude.
 * @apiSuccess {Number} location.geoLocation The geographical location.
 * @apiSuccess {String} location.virtualLocation The virtual location.
 * @apiSuccess {String} dataRouterAndPreprocessorBaseURL The base URL to the data router and preprocessor of the edge gateway.
 * @apiSuccess {String} edgeAnalyticsEngineBaseURL The base URL to the edge analytics engine of the edge gateway.
 * @apiSuccess {String[]} [additionalInformation] Additional information about the edge gateway.
 * @apiSuccessExample Success
 *   HTTP/1.1 200 OK
 *   {
 *     "id": "d902fdab-6146-4ee3-91c3-a32f85f96305",
 *     "name": "Machine #1",
 *     "description": "Some machine.",
 *     "namespace": "machine1",
 *     "macAddress": "63-80-5F-E6-54-9D",
 *     "location": {
 *       "virtualLocation": "floor1"
 *     },
 *     "dataRouterAndPreprocessorBaseURL": "http://localhost:7777/api",
 *     "edgeAnalyticsEngineBaseURL": "http://localhost:9999/api"
 *   }
 *
 * @apiError (Error 400) MISSING_NAME The name is missing.
 * @apiError (Error 400) MISSING_NAMESPACE The namespace is missing.
 * @apiError (Error 400) MISSING_MAC_ADDRESS The MAC address is missing.
 * @apiError (Error 400) MISSING_MAC_ADDRESS The MAC address is missing.
 * @apiError (Error 400) MISSING_DATA_ROUTER_AND_PREPROCESSOR_BASE_URL The base URL to the data router and preprocessor is missing.
 * @apiError (Error 400) MISSING_EDGE_ANALYTICS_ENGINE_BASE_URL The base URL to the edge analytics engine is missing.
 * @apiError (Error 400) NAME_TAKEN The name is taken.
 * @apiError (Error 400) NAMESPACE_TAKEN The namespece is taken.
 * @apiError (Error 404) EDGE_GATEWAY_NOT_FOUND The edge gateway was not found.
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "FAILED"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -H 'Content-Type: application/json' \
 *        -d '{ "name": "Machine #1", "description": "Some machine.", "namespace": "machine1", "macAddress": "63-80-5F-E6-54-9D", "location": { "virtualLocation": "floor1" }, "dataRouterAndPreprocessorBaseURL": "http://localhost:7777/api", "edgeAnalyticsEngineBaseURL": "http://localhost:9999/api" }' \
 *        -X PUT http://localhost:6666/api/edge-gateways/d902fdab-6146-4ee3-91c3-a32f85f96305
 */
router.route('/:id').put(validate(blueprint.updateEdgeGateway),
  lift(method.updateEdgeGateway), respond);

/**
 * @api {get} /edge-gateways/:id Get edge gateway
 * @apiName GetEdgeGateway
 * @apiDescription Gets an edge gateway.
 * @apiGroup EDGE GATEWAYS
 *
 * @apiParam {String} id The ID of the edge gateway.
 *
 * @apiSuccess {String} id The ID of the edge gateway.
 * @apiSuccess {String} name The name of the edge gateway.
 * @apiSuccess {String} [description] The description of the edge gateway.
 * @apiSuccess {String} namespace The namespace of the edge gateway.
 * @apiSuccess {String} macAddress The MAC address of the edge gateway.
 * @apiSuccess {Object} [location] The location of the edge gateway.
 * @apiSuccess {Object} location.geoLocation.latitude The latitude.
 * @apiSuccess {Number} location.geoLocation.longitude The longitude.
 * @apiSuccess {Number} location.geoLocation The geographical location.
 * @apiSuccess {String} location.virtualLocation The virtual location.
 * @apiSuccess {String} dataRouterAndPreprocessorBaseURL The base URL to the data router and preprocessor of the edge gateway.
 * @apiSuccess {String} edgeAnalyticsEngineBaseURL The base URL to the edge analytics engine of the edge gateway.
 * @apiSuccess {String[]} [additionalInformation] Additional information about the edge gateway.
 * @apiSuccessExample Success
 *   HTTP/1.1 200 OK
 *   {
 *     "id": "d902fdab-6146-4ee3-91c3-a32f85f96305",
 *     "name": "Machine #1",
 *     "description": "Some machine.",
 *     "namespace": "machine1",
 *     "macAddress": "63-80-5F-E6-54-9D",
 *     "location": {
 *       "virtualLocation": "floor1"
 *     },
 *     "dataRouterAndPreprocessorBaseURL": "http://localhost:7777/api",
 *     "edgeAnalyticsEngineBaseURL": "http://localhost:9999/api"
 *   }
 *
 * @apiError (Error 404) EDGE_GATEWAY_NOT_FOUND The edge gateway was not found.
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "EDGE_GATEWAY_NOT_FOUND"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -X GET http://localhost:6666/api/edge-gateways/d902fdab-6146-4ee3-91c3-a32f85f96305
 */
router.route('/:id').get(validate(blueprint.getEdgeGateway), lift(method.getEdgeGateway), respond);

/**
 * @api {delete} /edge-gateways/:id Delete edge gateway
 * @apiName DeleteEdgeGateway
 * @apiDescription Deletes an edge gateway.
 * @apiGroup EDGE GATEWAYS
 *
 * @apiSuccess {String} id The ID of the edge gateway.
 *
 * @apiSuccessExample Success
 *   HTTP/1.1 204 No Content
 *
 * @apiError (Error 404) EDGE_GATEWAY_NOT_FOUND The edge gateway was not found.
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "EDGE_GATEWAY_NOT_FOUND"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -X DELETE http://localhost:8888/api/edge-gateways/d902fdab-6146-4ee3-91c3-a32f85f96305
 */
router.route('/:id').delete(validate(blueprint.deleteEdgeGateway), lift(method.deleteEdgeGateway), respond);

/**
 * @api {post} /edge-gateways/discover Discover edge gateways
 * @apiName DiscoverEdgeGateways
 * @apiDescription Discovers edge gateways.
 * @apiGroup EDGE GATEWAYS
 *
 * @apiParam {String} [id] The ID of the edge gateway.
 * @apiParam {String} [name] The name of the edge gateway.
 * @apiParam {String} [namespace] The namespace of the edge gateway.
 * @apiParam {String} [macAddress] The MAC address of the edge gateway.
 * @apiParamExample {json} Request
 *   {
 *   }
 *
 * @apiSuccess {Object[]} edgeGateways The edge gateways that match the given criteria.
 * @apiSuccess {String} edgeGateways.id The ID of the edge gateway.
 * @apiSuccess {String} edgeGateways.name The name of the edge gateway.
 * @apiSuccess {String} [edgeGateways.description] The description of the edge gateway.
 * @apiSuccess {String} edgeGateways.namespace The namespace of the edge gateway.
 * @apiSuccess {String} edgeGateways.macAddress The MAC address of the edge gateway.
 * @apiSuccess {Object} [edgeGateways.location] The location of the edge gateway.
 * @apiSuccess {Object} edgeGateways.location.geoLocation.latitude The latitude.
 * @apiSuccess {Number} edgeGateways.location.geoLocation.longitude The longitude.
 * @apiSuccess {Number} edgeGateways.location.geoLocation The geographical location.
 * @apiSuccess {String} edgeGateways.location.virtualLocation The virtual location.
 * @apiSuccess {String} edgeGateways.dataRouterAndPreprocessorBaseURL The base URL to the data router and preprocessor of the edge gateway.
 * @apiSuccess {String} edgeGateways.edgeAnalyticsEngineBaseURL The base URL to the edge analytics engine of the edge gateway.
 * @apiSuccess {String[]} [edgeGateways.additionalInformation] Additional information about the edge gateway.
 * @apiSuccessExample Success
 *   HTTP/1.1 200 OK
 *   {
 *     "edgeGateways" : [
 *       {
 *         "id": "d902fdab-6146-4ee3-91c3-a32f85f96305",
 *         "name": "Machine #1",
 *         "description": "Some machine.",
 *         "namespace": "machine1",
 *         "macAddress": "63-80-5F-E6-54-9D",
 *         "location": {
 *           "virtualLocation": "floor1"
 *         },
 *         "dataRouterAndPreprocessorBaseURL": "http://localhost:7777/api",
 *         "edgeAnalyticsEngineBaseURL": "http://localhost:9999/api"
 *       }
 *     ]
 *   }
 *
 * @apiError (Error 500) FAILED The request failed.
 * @apiErrorExample Error
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "FAILED"
 *   }
 *
 * @apiExample {curl} Example
 *   curl -H 'Content-Type: application/json' \
 *        -d '{ }' \
 *        -X POST http://localhost:6666/api/edge-gateways/discover
 */
router.route('/discover').post(validate(blueprint.discoverEdgeGateways),
  lift(method.discoverEdgeGateways), respond);

module.exports = router;
