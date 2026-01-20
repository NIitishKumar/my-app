const express = require('express');
const {
  getStudentAttendance,
  getStudentAttendanceStats,
  getStudentAttendanceCalendar,
  exportStudentAttendance
} = require('../controllers/studentAttendanceController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/student/attendance - Get student's attendance records
// Query: startDate, endDate, classId, status, page, limit
router.get('/', getStudentAttendance);

// GET /api/student/attendance/stats - Get attendance statistics
// Query: startDate, endDate, period
router.get('/stats', getStudentAttendanceStats);

// GET /api/student/attendance/calendar - Get attendance calendar
// Query: year, month, classId
router.get('/calendar', getStudentAttendanceCalendar);

// GET /api/student/attendance/export - Export attendance report
// Query: startDate, endDate, format, classId
router.get('/export', exportStudentAttendance);

module.exports = router;
