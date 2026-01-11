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

// Apply admin verification to all routes
router.use(verifyAdmin);

// All routes are prefixed with /subjects when mounted
// So GET /api/admin/subjects becomes router.get('/')

// GET / - List all subjects (with pagination, search, filtering)
router.get('/',
  validateSubjectQuery,
  readRateLimiter,
  getAllSubjects
);

// GET /:id - Get single subject by ID
router.get('/:id',
  validateObjectId('id'),
  readRateLimiter,
  getSubjectById
);

// POST / - Create new subject
router.post('/',
  validateSubjectCreation,
  mutateRateLimiter,
  auditMiddleware('create'),
  createSubject
);

// PUT /:id - Update subject
router.put('/:id',
  validateObjectId('id'),
  validateSubjectUpdate,
  mutateRateLimiter,
  auditMiddleware('update'),
  updateSubject
);

// DELETE /:id - Delete subject
router.delete('/:id',
  validateObjectId('id'),
  mutateRateLimiter,
  auditMiddleware('delete'),
  deleteSubject
);

module.exports = router;
