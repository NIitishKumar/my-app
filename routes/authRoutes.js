const express = require('express');
const {
  login,
  getCurrentUser,
  changePassword
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login - Login endpoint
router.post('/login', login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', authenticateToken, getCurrentUser);

// POST /api/auth/change-password - Change password (protected)
router.post('/change-password', authenticateToken, changePassword);

module.exports = router;
