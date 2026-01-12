const express = require('express');
const router = express.Router();
const {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');
const { authenticateToken } = require('../middleware/auth');
const { verifyAdmin } = require('../middleware/admin');
const {
  validateObjectId,
  validateNoticeCreation,
  validateNoticeUpdate,
  validateNoticeQuery
} = require('../middleware/noticeValidation');
const { readRateLimiter, mutateRateLimiter } = require('../middleware/rateLimiter');
const { auditMiddleware } = require('../utils/auditLog');

// Apply authentication to all routes
router.use(authenticateToken);

// Apply admin verification to all routes (admin only)
router.use(verifyAdmin);

// GET / - List all notices (with filtering)
router.get('/',
  validateNoticeQuery,
  readRateLimiter,
  getAllNotices
);

// GET /:id - Get single notice by ID
router.get('/:id',
  validateObjectId('id'),
  readRateLimiter,
  getNoticeById
);

// POST / - Create new notice
router.post('/',
  validateNoticeCreation,
  mutateRateLimiter,
  auditMiddleware('create'),
  createNotice
);

// PUT /:id - Update notice
router.put('/:id',
  validateObjectId('id'),
  validateNoticeUpdate,
  mutateRateLimiter,
  auditMiddleware('update'),
  updateNotice
);

// DELETE /:id - Delete notice
router.delete('/:id',
  validateObjectId('id'),
  mutateRateLimiter,
  auditMiddleware('delete'),
  deleteNotice
);

module.exports = router;
