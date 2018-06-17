const express = require('express');

const dataSources = require('./data-sources');
const healthCheck = require('./health-check');

const router = express.Router();

router.use('/data-sources', dataSources);
router.use('/health-check', healthCheck);

module.exports = router;
