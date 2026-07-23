const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

// GET available slots for a date (Customer Facing)
router.get('/available', slotController.getAvailableSlots);

// GET all slots with their booking count
router.get('/', slotController.getAllSlots);

// POST create a new slot
router.post('/', slotController.createSlot);

// PUT edit an existing slot
router.put('/:id', slotController.updateSlot);

// PATCH enable a slot
router.patch('/:id/enable', slotController.enableSlot);

// PATCH disable a slot
router.patch('/:id/disable', slotController.disableSlot);

// DELETE a slot (only if no active bookings)
router.delete('/:id', slotController.deleteSlot);

module.exports = router;
