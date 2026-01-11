const express = require('express');
const router = express.Router();
const {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const { authenticateToken } = require('../middleware/auth');
const { verifyAdmin } = require('../middleware/admin');
const {
  validateObjectId,
  validateSubjectCreation,
  validateSubjectUpdate,
  validateSubjectQuery
} = require('../middleware/subjectValidation');
const { readRateLimiter, mutateRateLimiter } = require('../middleware/rateLimiter');
const { auditMiddleware } = require('../utils/auditLog');

// Apply authentication to all routes
router.use(authenticateToken);

// All routes are prefixed with /subjects when mounted
// So GET /api/admin/subjects becomes router.get('/')

// GET / - List all subjects (with pagination, search, filtering)
// Accessible by all authenticated users (ADMIN, TEACHER, PARENT, STUDENT)
router.get('/',
  validateSubjectQuery,
  readRateLimiter,
  getAllSubjects
);

// GET /:id - Get single subject by ID
// Accessible by all authenticated users (ADMIN, TEACHER, PARENT, STUDENT)
router.get('/:id',
  validateObjectId('id'),
  readRateLimiter,
  getSubjectById
);

// POST / - Create new subject
// Admin only
router.post('/',
  verifyAdmin,
  validateSubjectCreation,
  mutateRateLimiter,
  auditMiddleware('create'),
  createSubject
);

// PUT /:id - Update subject
// Admin only
router.put('/:id',
  verifyAdmin,
  validateObjectId('id'),
  validateSubjectUpdate,
  mutateRateLimiter,
  auditMiddleware('update'),
  updateSubject
);

// DELETE /:id - Delete subject
// Admin only
router.delete('/:id',
  verifyAdmin,
  validateObjectId('id'),
  mutateRateLimiter,
  auditMiddleware('delete'),
  deleteSubject
);

module.exports = router;
