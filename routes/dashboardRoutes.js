const express = require('express');
const {
  getDashboardStats,
  getQuickStats
} = require('../controllers/dashboardController');

const router = express.Router();

// GET /api/dashboard/stats - Get complete dashboard statistics
router.get('/stats', getDashboardStats);

// GET /api/dashboard/quick - Get quick overview stats (lightweight)
router.get('/quick', getQuickStats);

module.exports = router;
