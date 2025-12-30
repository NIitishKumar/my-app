const express = require('express');
const {
  createLecture,
  getAllLectures,
  getLectureById,
  updateLecture,
  deleteLecture
} = require('../controllers/lectureController');

const router = express.Router();

// POST /api/lectures - Create new lecture
router.post('/', createLecture);

// GET /api/lectures - Get all lectures
router.get('/', getAllLectures);

// GET /api/lectures/:id - Get lecture by ID
router.get('/:id', getLectureById);

// PUT /api/lectures/:id - Update lecture
router.put('/:id', updateLecture);

// DELETE /api/lectures/:id - Delete lecture
router.delete('/:id', deleteLecture);

module.exports = router;