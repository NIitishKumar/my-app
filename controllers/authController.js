const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getDatabase, ObjectId } = require('../db');

// JWT Secret (should be in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Login endpoint
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDatabase();

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Try to find user in different collections (order: teachers, students, parents)
    let user = null;
    let userRole = null;
    let collectionName = null;

    // Check teachers collection
    user = await db.collection('teachers').findOne({
      email: email,
      isActive: true
    });
    if (user) {
      userRole = user.role === 'ADMIN' ? 'ADMIN' : 'TEACHER';
      collectionName = 'teachers';
    }

    // If not found in teachers, check students
    if (!user) {
      user = await db.collection('students').findOne({
        email: email,
        isActive: true
      });
      if (user) {
        userRole = 'STUDENT';
        collectionName = 'students';
      }
    }

    // If not found in students, check parents
    if (!user) {
      user = await db.collection('parents').findOne({
        email: email,
        isActive: true
      });
      if (user) {
        userRole = 'PARENT';
        collectionName = 'parents';
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user has a password field
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Account not set up with password. Please contact administrator.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: userRole,
        employeeId: user.employeeId || null,
        studentId: user.studentId || null
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Build response based on role
    const userData = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      role: userRole
    };

    // Add role-specific fields
    if (userRole === 'TEACHER' || userRole === 'ADMIN') {
      userData.employeeId = user.employeeId;
      userData.department = user.department;
    } else if (userRole === 'STUDENT') {
      userData.studentId = user.studentId;
      userData.dateOfBirth = user.dateOfBirth;
      userData.gender = user.gender;
    } else if (userRole === 'PARENT') {
      userData.phoneNumber = user.phoneNumber;
    }

    // Return user data and token
    res.status(200).json({
      success: true,
      token: token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Get current user (verify token)
const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const db = getDatabase();
    const teacher = await db.collection('teachers').findOne({
      _id: new ObjectId(req.user.id),
      isActive: true
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Determine role
    const userRole = teacher.role === 'ADMIN' ? 'ADMIN' : 'TEACHER';

    res.status(200).json({
      success: true,
      data: {
        id: teacher._id.toString(),
        email: teacher.email,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        name: `${teacher.firstName} ${teacher.lastName}`,
        role: userRole,
        employeeId: teacher.employeeId,
        department: teacher.department,
        phone: teacher.phone,
        subjects: teacher.subjects,
        qualification: teacher.qualification,
        isActive: teacher.isActive
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Change password (optional utility endpoint)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const db = getDatabase();

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const teacher = await db.collection('teachers').findOne({
      _id: new ObjectId(req.user.id),
      isActive: true
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, teacher.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.collection('teachers').updateOne(
      { _id: new ObjectId(req.user.id) },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );

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

// Utility function to hash password (for initial setup)
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

module.exports = {
  login,
  getCurrentUser,
  changePassword,
  hashPassword
};
