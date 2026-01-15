const express = require('express');
const {
  getDashboardStats,
  getUpcomingExams,
  getRecentNotifications,
  getAttendanceStats,
  getAcademicSummary,
  getTodaySchedule
} = require('../controllers/studentDashboardController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// 1. Dashboard Statistics
router.get('/dashboard/stats', getDashboardStats);

// 2. Upcoming Exams
router.get('/exams', getUpcomingExams);

// 3. Recent Notifications
router.get('/notifications', getRecentNotifications);

// 4. Attendance Statistics
router.get('/dashboard/attendance', getAttendanceStats);

// 5. Academic Summary
router.get('/dashboard/academic-summary', getAcademicSummary);

// 6. Today's Schedule
router.get('/dashboard/schedule/today', getTodaySchedule);

module.exports = router;
