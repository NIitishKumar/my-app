const express = require('express');
const {
  getClassAttendance,
  getAttendanceByDate,
  getAttendanceByLecture,
  createAttendance,
  updateAttendance,
  deleteAttendance
} = require('../controllers/attendanceController');

const router = express.Router();

// GET /api/attendance/classes/:classId/attendance - Get all attendance for a class
router.get('/classes/:classId/attendance', getClassAttendance);

// GET /api/attendance/classes/:classId/attendance/date/:date - Get attendance for specific date
router.get('/classes/:classId/attendance/date/:date', getAttendanceByDate);

// GET /api/attendance/classes/:classId/attendance/lecture/:lectureId - Get attendance for specific lecture
router.get('/classes/:classId/attendance/lecture/:lectureId', getAttendanceByLecture);

// POST /api/attendance/classes/:classId/attendance - Create attendance record
router.post('/classes/:classId/attendance', createAttendance);

// PUT /api/attendance/classes/:classId/attendance/:recordId - Update attendance record
router.put('/classes/:classId/attendance/:recordId', updateAttendance);

// DELETE /api/attendance/classes/:classId/attendance/:recordId - Delete attendance record
router.delete('/classes/:classId/attendance/:recordId', deleteAttendance);

module.exports = router;
