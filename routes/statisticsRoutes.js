const express = require('express');
const router = express.Router();
const {
  getClassStatistics,
  getStudentHistory,
  getDailyAttendanceReport,
  getAttendanceTrends
} = require('../controllers/statisticsController');
const { authenticateToken, verifyTeacherClass } = require('../middleware/auth');
const { verifyTeacherOrAdmin } = require('../middleware/admin');
const {
  validateObjectId,
  validateStatisticsQuery,
  validateAttendanceQuery
} = require('../middleware/validation');
const { readRateLimiter } = require('../middleware/rateLimiter');

// Get Class Attendance Statistics
// GET /api/attendance/classes/:classId/statistics
router.get('/classes/:classId/statistics',
  validateObjectId('classId'),
  authenticateToken,
  verifyTeacherClass,
  validateStatisticsQuery,
  readRateLimiter,
  getClassStatistics
);

// Get Student Attendance History
// GET /api/attendance/students/:studentId
router.get('/students/:studentId',
  validateObjectId('studentId'),
  authenticateToken,
  validateStatisticsQuery,
  readRateLimiter,
  getStudentHistory
);

// Get Daily Attendance Report
// GET /api/attendance/reports/daily
router.get('/reports/daily',
  authenticateToken,
  verifyTeacherOrAdmin,
  readRateLimiter,
  getDailyAttendanceReport
);

// Get Attendance Trends
// GET /api/attendance/reports/trends
router.get('/reports/trends',
  authenticateToken,
  verifyTeacherOrAdmin,
  validateStatisticsQuery,
  readRateLimiter,
  getAttendanceTrends
);

module.exports = router;
