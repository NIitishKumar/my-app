const express = require('express');
const {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass
} = require('../controllers/classController');

const router = express.Router();

// GET /api/classes - Get all classes
router.get('/', getAllClasses);

// GET /api/classes/:id - Get class by ID
router.get('/:id', getClassById);

// POST /api/classes - Create new class
router.post('/', createClass);

// PUT /api/classes/:id - Update class
router.put('/:id', updateClass);

// DELETE /api/classes/:id - Delete class
router.delete('/:id', deleteClass);

// POST /api/classes/:id/students - Add student to class
router.post('/:id/students', addStudentToClass);

// DELETE /api/classes/:id/students/:studentId - Remove student from class
router.delete('/:id/students/:studentId', removeStudentFromClass);

module.exports = router;