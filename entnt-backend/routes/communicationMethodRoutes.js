const express = require('express');
const router = express.Router();
const communicationMethodController = require('../controllers/communicationMethodController');

// Routes for communication methods
router.get('/', communicationMethodController.getAllMethods);
router.post('/', communicationMethodController.addMethod);
router.put('/:id', communicationMethodController.updateMethod);
router.delete('/:id', communicationMethodController.deleteMethod);

module.exports = router;