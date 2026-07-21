const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

router.get('/check', availabilityController.checkAvailability);
router.get('/', availabilityController.getAllOverrides);
router.post('/disable', availabilityController.disableTime);
router.put('/disable/:id', availabilityController.updateOverride);
router.delete('/disable/:id', availabilityController.enableTime);

module.exports = router;
