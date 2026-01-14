const { getDatabase, ObjectId } = require('../db');
const bcrypt = require('bcryptjs');

// Helper function to get user data based on role
const getUserByRole = async (db, userId, role) => {
  const collections = {
    ADMIN: 'admins',
    TEACHER: 'teachers',
    STUDENT: 'students',
    PARENT: 'parents'
  };

  const collection = collections[role];
  if (!collection) {
    return null;
  }

  return await db.collection(collection).findOne({
    _id: new ObjectId(userId)
  });
};

// Helper function to get safe profile data (exclude sensitive fields)
const getSafeProfile = (user, role) => {
  const safeData = {
    id: user._id.toString(),
    role: role,
    email: user.email,
    profilePicture: user.profilePicture || null
  };

  // Role-specific fields
  if (role === 'ADMIN' || role === 'TEACHER') {
    safeData.firstName = user.firstName;
    safeData.lastName = user.lastName;
    safeData.phoneNumber = user.phoneNumber || null;
    if (role === 'TEACHER') {
      safeData.employeeId = user.employeeId || null;
      safeData.department = user.department || null;
      safeData.qualification = user.qualification || null;
    }
  } else if (role === 'STUDENT') {
    safeData.firstName = user.firstName;
    safeData.lastName = user.lastName;
    safeData.studentId = user.studentId || null;
    safeData.dateOfBirth = user.dateOfBirth || null;
    safeData.gender = user.gender || null;
    safeData.address = user.address || null;
    safeData.enrollmentDate = user.enrollmentDate || null;
  } else if (role === 'PARENT') {
    safeData.firstName = user.firstName;
    safeData.lastName = user.lastName;
    safeData.phoneNumber = user.phoneNumber || null;
  }

  return safeData;
};

// GET /api/users/profile - Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const db = getDatabase();

    const user = await getUserByRole(db, userId, userRole);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const profileData = getSafeProfile(user, userRole);

    res.status(200).json({
      success: true,
      data: profileData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// PUT /api/users/profile - Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const updateData = req.body;
    const db = getDatabase();

    // Get current user data
    const user = await getUserByRole(db, userId, userRole);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Build update object based on role
    const allowedUpdates = {};

    if (userRole === 'ADMIN' || userRole === 'TEACHER') {
      if (updateData.firstName) allowedUpdates.firstName = updateData.firstName.trim();
      if (updateData.lastName) allowedUpdates.lastName = updateData.lastName.trim();
      if (updateData.phoneNumber !== undefined) allowedUpdates.phoneNumber = updateData.phoneNumber ? updateData.phoneNumber.trim() : null;
      if (userRole === 'TEACHER') {
        if (updateData.department !== undefined) allowedUpdates.department = updateData.department ? updateData.department.trim() : null;
        if (updateData.qualification !== undefined) allowedUpdates.qualification = updateData.qualification ? updateData.qualification.trim() : null;
      }
    } else if (userRole === 'STUDENT') {
      if (updateData.firstName) allowedUpdates.firstName = updateData.firstName.trim();
      if (updateData.lastName) allowedUpdates.lastName = updateData.lastName.trim();
      if (updateData.gender !== undefined) allowedUpdates.gender = updateData.gender ? updateData.gender.trim() : null;
      if (updateData.address !== undefined) allowedUpdates.address = updateData.address ? updateData.address.trim() : null;
      if (updateData.dateOfBirth !== undefined) {
        allowedUpdates.dateOfBirth = updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : null;
      }
    } else if (userRole === 'PARENT') {
      if (updateData.firstName) allowedUpdates.firstName = updateData.firstName.trim();
      if (updateData.lastName) allowedUpdates.lastName = updateData.lastName.trim();
      if (updateData.phoneNumber !== undefined) allowedUpdates.phoneNumber = updateData.phoneNumber ? updateData.phoneNumber.trim() : null;
    }

    // Add updated timestamp
    allowedUpdates.updatedAt = new Date();

    // Update user
    const collections = {
      ADMIN: 'admins',
      TEACHER: 'teachers',
      STUDENT: 'students',
      PARENT: 'parents'
    };

    const result = await db.collection(collections[userRole]).updateOne(
      { _id: new ObjectId(userId) },
      { $set: allowedUpdates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get updated user
    const updatedUser = await getUserByRole(db, userId, userRole);
    const profileData = getSafeProfile(updatedUser, userRole);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profileData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// POST /api/users/profile/avatar - Upload profile picture
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const db = getDatabase();

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed'
      });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 5MB limit'
      });
    }

    // Convert file to base64
    const base64Image = req.file.buffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

    // Update user profile
    const collections = {
      ADMIN: 'admins',
      TEACHER: 'teachers',
      STUDENT: 'students',
      PARENT: 'parents'
    };

    const result = await db.collection(collections[userRole]).updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          profilePicture: dataURI,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePicture: dataURI
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading profile picture',
      error: error.message
    });
  }
};

// PUT /api/users/password - Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { currentPassword, newPassword } = req.body;
    const db = getDatabase();

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    // Get user
    const user = await getUserByRole(db, userId, userRole);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has a password (some users might not)
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'Password cannot be changed for this account'
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    const collections = {
      ADMIN: 'admins',
      TEACHER: 'teachers',
      STUDENT: 'students',
      PARENT: 'parents'
    };

    const result = await db.collection(collections[userRole]).updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  changePassword
};
