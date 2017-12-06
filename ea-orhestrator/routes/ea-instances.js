const express = require('express');

const controller = require('../controllers/ea-instances');

const router = express.Router();

router.route('/').get(controller.getEaInstances);

router.route('/').post(controller.launchEaInstance);

router.route('/:id').delete(controller.terminateEaInstance);

module.exports = router;
