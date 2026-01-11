const express = require('express');
const router = express.Router();
const {
  getAllAttendanceRecords,
  lockUnlockAttendance,
  bulkImportAttendance,
  getAttendanceSummary
} = require('../controllers/adminAttendanceController');
const { authenticateToken } = require('../middleware/auth');
const { verifyAdmin } = require('../middleware/admin');
const {
  validateObjectId,
  validateAttendanceQuery,
  validateLockRequest,
  validateBulkImport
} = require('../middleware/validation');
const { readRateLimiter, mutateRateLimiter } = require('../middleware/rateLimiter');
const { auditMiddleware } = require('../utils/auditLog');

// Apply authentication to all routes
router.use(authenticateToken);

// Apply admin verification to all routes
router.use(verifyAdmin);

// Get All Attendance Records (Admin)
// GET /api/admin/attendance
router.get('/attendance',
  authenticateToken,
  validateAttendanceQuery,
  readRateLimiter,
  getAllAttendanceRecords
);

// Lock/Unlock Attendance Record
// PATCH /api/admin/attendance/:recordId/lock
router.patch('/attendance/:recordId/lock',
  validateObjectId('recordId'),
  validateLockRequest,
  mutateRateLimiter,
  auditMiddleware('lock'),
  lockUnlockAttendance
);

// Bulk Import Attendance
// POST /api/admin/attendance/bulk-import
router.post('/attendance/bulk-import',
  validateBulkImport,
  mutateRateLimiter,
  auditMiddleware('bulkImport'),
  bulkImportAttendance
);

// Get Attendance Summary (Admin Dashboard)
// GET /api/admin/attendance/summary
router.get('/attendance/summary',
  authenticateToken,
  readRateLimiter,
  getAttendanceSummary
);

module.exports = router;
