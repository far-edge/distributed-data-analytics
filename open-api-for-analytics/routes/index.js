const express = require('express');

const analyticsInstances = require('./analytics-instances');
const dataSources = require('./data-sources');
const edgeGateways = require('./edge-gateways');
const healthCheck = require('./health-check');

const router = express.Router();

router.use('/analytics-instances', analyticsInstances);
router.use('/data-sources', dataSources);
router.use('/edge-gateways', edgeGateways);
router.use('/health-check', healthCheck);

module.exports = router;
