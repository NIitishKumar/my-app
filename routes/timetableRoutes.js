const express = require('express');
const {
  getWeeklyTimetable,
  getDayTimetable,
  getTimetableByDateRange
} = require('../controllers/timetableController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// 1. Get Weekly Timetable
// GET /api/student/timetable/week?weekStart=2026-01-13
router.get('/week', getWeeklyTimetable);

// 2. Get Day Timetable
// GET /api/student/timetable/day?date=2026-01-15
router.get('/day', getDayTimetable);

// 3. Get Timetable by Date Range
// GET /api/student/timetable?startDate=2026-01-13&endDate=2026-01-26
router.get('/', getTimetableByDateRange);

module.exports = router;
