const express = require('express');
const {
  getAssignedClasses,
  getClassDetails,
  getTeacherProfile
} = require('../controllers/teacherPortalController');
const { authenticateToken, verifyTeacherClass } = require('../middleware/auth');

const router = express.Router();

// GET /api/teacher/classes - Get all assigned classes for teacher
router.get('/classes', authenticateToken, getAssignedClasses);

// GET /api/teacher/classes/:classId - Get specific class details
router.get('/classes/:classId', authenticateToken, verifyTeacherClass, getClassDetails);

// GET /api/teacher/profile - Get teacher profile
router.get('/profile', authenticateToken, getTeacherProfile);

module.exports = router;
