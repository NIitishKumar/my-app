const express = require('express');
const router = express.Router();
const {
  exportAttendanceReport,
  exportClassStatistics
} = require('../controllers/exportController');
const { authenticateToken } = require('../middleware/auth');
const { verifyTeacherOrAdmin } = require('../middleware/admin');
const { validateObjectId, validateExportQuery } = require('../middleware/validation');
const { exportRateLimiter } = require('../middleware/rateLimiter');

// Export Attendance Report (Excel/CSV)
// GET /api/admin/attendance/export
router.get('/attendance/export',
  authenticateToken,
  verifyTeacherOrAdmin,
  validateExportQuery,
  exportRateLimiter,
  exportAttendanceReport
);

// Export Class Statistics
// GET /api/admin/attendance/export/statistics/:classId
router.get('/attendance/export/statistics/:classId',
  validateObjectId('classId'),
  authenticateToken,
  verifyTeacherOrAdmin,
  validateExportQuery,
  exportRateLimiter,
  exportClassStatistics
);

module.exports = router;
