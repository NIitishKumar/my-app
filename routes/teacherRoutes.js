const express = require('express');
const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  hardDeleteTeacher,
  getTeachersByDepartment,
  getTeacherStats,
  addClassToTeacher,
  removeClassFromTeacher,
  getTeacherWithClasses
} = require('../controllers/teacherController');

const router = express.Router();

// GET /api/teachers - Get all teachers with pagination and filtering
router.get('/', getAllTeachers);

// GET /api/teachers/stats - Get teacher statistics
router.get('/stats', getTeacherStats);

// GET /api/teachers/department/:department - Get teachers by department
router.get('/department/:department', getTeachersByDepartment);

// GET /api/teachers/:id - Get teacher by ID
router.get('/:id', getTeacherById);

// GET /api/teachers/:id/classes - Get teacher with populated classes
router.get('/:id/classes', getTeacherWithClasses);

// POST /api/teachers - Create new teacher
router.post('/', createTeacher);

// POST /api/teachers/:id/classes - Add class to teacher
router.post('/:id/classes', addClassToTeacher);

// PUT /api/teachers/:id - Update teacher
router.put('/:id', updateTeacher);

// DELETE /api/teachers/:id/classes - Remove class from teacher
router.delete('/:id/classes', removeClassFromTeacher);

// DELETE /api/teachers/:id - Soft delete teacher
router.delete('/:id', deleteTeacher);

// DELETE /api/teachers/:id/hard - Hard delete teacher (permanent)
router.delete('/:id/hard', hardDeleteTeacher);

module.exports = router;