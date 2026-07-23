const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

// GET all virtual slots with their booking count
router.get('/', slotController.getAllSlots);

// PATCH enable a slot
router.patch('/enable', slotController.enableSlot);

// PATCH disable a slot
router.patch('/disable', slotController.disableSlot);

module.exports = router;
