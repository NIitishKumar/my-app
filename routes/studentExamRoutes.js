const express = require('express');
const {
  getStudentExams,
  getStudentExamById,
  getUpcomingExams,
  getStudentExamResults,
  getStudentExamCalendar,
  exportStudentExams
} = require('../controllers/studentExamController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/student/exams/export - Export exam schedule
router.get('/export', exportStudentExams);

// GET /api/student/exams/calendar - Get exam calendar
router.get('/calendar', getStudentExamCalendar);

// GET /api/student/exams/results - Get exam results
router.get('/results', getStudentExamResults);

// GET /api/student/exams/upcoming - Get upcoming exams
router.get('/upcoming', getUpcomingExams);

// GET /api/student/exams - Get student's exams
router.get('/', getStudentExams);

// GET /api/student/exams/:id - Get exam details
router.get('/:id', getStudentExamById);

module.exports = router;
