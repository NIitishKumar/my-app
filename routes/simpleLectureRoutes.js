const express = require('express');
const {
  createSimpleLecture,
  getAllSimpleLectures,
  getSimpleLectureById
} = require('../controllers/simpleLectureController');

const router = express.Router();

// POST /api/simple-lectures - Create new lecture with simplified fields
router.post('/', createSimpleLecture);

// GET /api/simple-lectures - Get all lectures with pagination and filtering
router.get('/', getAllSimpleLectures);

// GET /api/simple-lectures/:id - Get lecture by ID with populated data
router.get('/:id', getSimpleLectureById);

module.exports = router;