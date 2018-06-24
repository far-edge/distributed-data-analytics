const express = require('express');

const router = express.Router({ mergeParams: true });

/**
 * @api {get} /health-check Check the health
 * @apiName CheckHealth
 * @apiDescription Checks the health of the open API for analytics.
 * @apiGroup HEALTH CHECK
 *
 * @apiSuccess {Number} uptime The number of seconds the edge analytics engine has been up.
 * @apiSuccessExample Success
 *   HTTP/1.1 200 OK
 *   {
 *     "uptime": 300
 *   }
 *
 * @apiExample {curl} Example
 *   curl -X GET http://localhost:8888/api/health-check
 */
router.route('/').get((_req, res, _next) => {
  res.json({
    uptime: Math.floor(process.uptime())
  });
});

module.exports = router;
