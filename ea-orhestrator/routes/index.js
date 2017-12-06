const express = require('express');

const eaInstances = require('./ea-instances');
const eaProcessorTypes = require('./ea-processor-types');

const router = express.Router();

router.use('/ea-instances', eaInstances);
router.use('/ea-processor-types', eaProcessorTypes);

module.exports = router;
