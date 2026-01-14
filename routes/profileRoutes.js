const express = require('express');
const multer = require('multer');
const {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  changePassword
} = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');
const { validateProfileUpdate, validatePasswordChange } = require('../middleware/profileValidation');

const router = express.Router();

// Configure multer for memory storage (storing files in memory as Buffer)
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// All routes require authentication
router.use(authenticateToken);

// GET /api/users/profile - Get user profile
router.get('/profile', getUserProfile);

// PUT /api/users/profile - Update user profile
router.put('/profile', validateProfileUpdate, updateUserProfile);

// POST /api/users/profile/avatar - Upload profile picture
router.post('/profile/avatar', upload.single('avatar'), uploadAvatar);

// PUT /api/users/password - Change password
router.put('/password', validatePasswordChange, changePassword);

module.exports = router;
