const express = require('express');
const {
  getClassAttendance,
  getAttendanceByDate,
  getAttendanceByLecture,
  createAttendance,
  updateAttendance,
  deleteAttendance
} = require('../controllers/attendanceController');
const { authenticateToken, verifyTeacherClass, verifyAttendanceOwner } = require('../middleware/auth');
const {
  validateObjectId,
  validateDateParam,
  validateAttendanceCreation,
  validateAttendanceUpdate,
  validateAttendanceQuery
} = require('../middleware/validation');
const { mutateRateLimiter, readRateLimiter } = require('../middleware/rateLimiter');
const { auditMiddleware } = require('../utils/auditLog');

const router = express.Router();

// GET /api/attendance/classes/:classId/attendance - Get all attendance for a class
router.get('/classes/:classId/attendance',
  validateObjectId('classId'),
  authenticateToken,
  verifyTeacherClass,
  validateAttendanceQuery,
  readRateLimiter,
  getClassAttendance
);

// GET /api/attendance/classes/:classId/attendance/date/:date - Get attendance for specific date
router.get('/classes/:classId/attendance/date/:date',
  validateObjectId('classId'),
  validateDateParam('date'),
  authenticateToken,
  verifyTeacherClass,
  readRateLimiter,
  getAttendanceByDate
);

// GET /api/attendance/classes/:classId/attendance/lecture/:lectureId - Get attendance for specific lecture
router.get('/classes/:classId/attendance/lecture/:lectureId',
  validateObjectId('classId'),
  validateObjectId('lectureId'),
  authenticateToken,
  verifyTeacherClass,
  readRateLimiter,
  getAttendanceByLecture
);

// POST /api/attendance/classes/:classId/attendance - Create attendance record
router.post('/classes/:classId/attendance',
  validateObjectId('classId'),
  validateAttendanceCreation,
  authenticateToken,
  verifyTeacherClass,
  mutateRateLimiter,
  auditMiddleware('create'),
  createAttendance
);

// PUT /api/attendance/classes/:classId/attendance/:recordId - Update attendance record
router.put('/classes/:classId/attendance/:recordId',
  validateObjectId('classId'),
  validateObjectId('recordId'),
  validateAttendanceUpdate,
  authenticateToken,
  verifyTeacherClass,
  verifyAttendanceOwner,
  mutateRateLimiter,
  auditMiddleware('update'),
  updateAttendance
);

// DELETE /api/attendance/classes/:classId/attendance/:recordId - Delete attendance record
router.delete('/classes/:classId/attendance/:recordId',
  validateObjectId('classId'),
  validateObjectId('recordId'),
  authenticateToken,
  verifyTeacherClass,
  verifyAttendanceOwner,
  mutateRateLimiter,
  auditMiddleware('delete'),
  deleteAttendance
);

module.exports = router;
