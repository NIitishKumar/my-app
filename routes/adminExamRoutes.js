const express = require('express');
const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  bulkCreateExams,
  getExamDashboard,
  getConflicts,
  getExamAnalytics
} = require('../controllers/adminExamController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/admin/exams/dashboard - Get exam dashboard
router.get('/dashboard', getExamDashboard);

// GET /api/admin/exams/conflicts - Check for conflicts
router.get('/conflicts', getConflicts);

// GET /api/admin/exams/analytics - Get exam analytics
router.get('/analytics', getExamAnalytics);

// POST /api/admin/exams/bulk - Bulk create exams
router.post('/bulk', bulkCreateExams);

// GET /api/admin/exams - Get all exams
router.get('/', getExams);

// POST /api/admin/exams - Create new exam
router.post('/', createExam);

// GET /api/admin/exams/:id - Get exam by ID
router.get('/:id', getExamById);

// PUT /api/admin/exams/:id - Update exam
router.put('/:id', updateExam);

// DELETE /api/admin/exams/:id - Delete exam
router.delete('/:id', deleteExam);

module.exports = router;
