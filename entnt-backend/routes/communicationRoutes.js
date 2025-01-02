const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');

router.get('/', communicationController.getAllCommunications);

module.exports = router;