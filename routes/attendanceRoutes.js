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

const router = express.Router();

// GET /api/attendance/classes/:classId/attendance - Get all attendance for a class
router.get('/classes/:classId/attendance', authenticateToken, verifyTeacherClass, getClassAttendance);

// GET /api/attendance/classes/:classId/attendance/date/:date - Get attendance for specific date
router.get('/classes/:classId/attendance/date/:date', authenticateToken, verifyTeacherClass, getAttendanceByDate);

// GET /api/attendance/classes/:classId/attendance/lecture/:lectureId - Get attendance for specific lecture
router.get('/classes/:classId/attendance/lecture/:lectureId', authenticateToken, verifyTeacherClass, getAttendanceByLecture);

// POST /api/attendance/classes/:classId/attendance - Create attendance record
router.post('/classes/:classId/attendance', authenticateToken, verifyTeacherClass, createAttendance);

// PUT /api/attendance/classes/:classId/attendance/:recordId - Update attendance record
router.put('/classes/:classId/attendance/:recordId', authenticateToken, verifyTeacherClass, verifyAttendanceOwner, updateAttendance);

// DELETE /api/attendance/classes/:classId/attendance/:recordId - Delete attendance record
router.delete('/classes/:classId/attendance/:recordId', authenticateToken, verifyTeacherClass, verifyAttendanceOwner, deleteAttendance);

module.exports = router;
