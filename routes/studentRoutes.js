const express = require('express');
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

const router = express.Router();

// POST /api/students - Create new student
router.post('/', createStudent);

// GET /api/students - Get all students
router.get('/', getAllStudents);

// GET /api/students/:id - Get student by ID
router.get('/:id', getStudentById);

// PUT /api/students/:id - Update student
router.put('/:id', updateStudent);

// DELETE /api/students/:id - Delete student
router.delete('/:id', deleteStudent);

module.exports = router;