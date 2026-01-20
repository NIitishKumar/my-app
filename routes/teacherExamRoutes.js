const express = require('express');
const {
  getTeacherExams,
  getTeacherExamById,
  getExamEnrollment,
  getTeacherUpcomingExams,
  getTeacherExamCalendar,
  createTeacherExam,
  updateTeacherExam,
  deleteTeacherExam
} = require('../controllers/teacherExamController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/teacher/exams/calendar - Get exam calendar
router.get('/calendar', getTeacherExamCalendar);

// GET /api/teacher/exams/upcoming - Get upcoming exams
router.get('/upcoming', getTeacherUpcomingExams);

// POST /api/teacher/exams - Create new exam
router.post('/', createTeacherExam);

// GET /api/teacher/exams - Get teacher's exams
router.get('/', getTeacherExams);

// PUT /api/teacher/exams/:id - Update exam
router.put('/:id', updateTeacherExam);

// DELETE /api/teacher/exams/:id - Delete exam
router.delete('/:id', deleteTeacherExam);

// GET /api/teacher/exams/:id - Get exam details
router.get('/:id', getTeacherExamById);

// GET /api/teacher/exams/:id/enrollment - Get enrolled students
router.get('/:id/enrollment', getExamEnrollment);

module.exports = router;
