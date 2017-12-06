const express = require('express');

const controller = require('../controllers/ea-processor-types');

const router = express.Router();

router.route('/').get(controller.getEaProcessorTypes);

router.route('/').post(controller.registerEaProcessorType);

router.route('/:name([^/]+/[^/]+)').delete(controller.unregisterEaProcessorType);

module.exports = router;
