const express = require('express');

const analyticsInstances = require('./analytics-instances');
const healthCheck = require('./health-check');

const router = express.Router();

router.use('/analytics-instances', analyticsInstances);
router.use('/health-check', healthCheck);

module.exports = router;
