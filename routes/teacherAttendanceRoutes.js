const express = require('express');
const router = express.Router();
const {
  getTeacherAttendanceDashboard,
  getTeacherAttendanceRecords,
  getTeacherClassStatistics
} = require('../controllers/teacherAttendanceController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateObjectId,
  validateAttendanceQuery,
  validateStatisticsQuery
} = require('../middleware/validation');
const { readRateLimiter } = require('../middleware/rateLimiter');

// Teacher Attendance Dashboard
// GET /api/teacher/attendance/dashboard
router.get('/attendance/dashboard',
  authenticateToken,
  readRateLimiter,
  getTeacherAttendanceDashboard
);

// Get Teacher's Attendance Records
// GET /api/teacher/attendance
router.get('/attendance',
  authenticateToken,
  validateAttendanceQuery,
  readRateLimiter,
  getTeacherAttendanceRecords
);

// Get Class Statistics (Teacher endpoint)
// GET /api/teacher/attendance/statistics/:classId
router.get('/attendance/statistics/:classId',
  validateObjectId('classId'),
  authenticateToken,
  validateStatisticsQuery,
  readRateLimiter,
  getTeacherClassStatistics
);

module.exports = router;
