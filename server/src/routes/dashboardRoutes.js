const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// All routes here should be protected ideally, but for now we follow the existing pattern
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
