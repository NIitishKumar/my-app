const jwt = require('jsonwebtoken');
const { getDatabase, ObjectId } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authenticate JWT token
const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization header required.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }

      // Attach user info to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        employeeId: decoded.employeeId
      };

      next();
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

// Verify teacher is assigned to the class
const verifyTeacherClass = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const classId = req.params.classId;
    const db = getDatabase();

    if (!ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class ID'
      });
    }

    // Check if class exists and has this teacher assigned
    const classData = await db.collection('classes').findOne({
      _id: new ObjectId(classId),
      isActive: true
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if teacher is assigned to this class
    // First check assignedTeachers array
    let isAssigned = false;

    if (classData.assignedTeachers && classData.assignedTeachers.length > 0) {
      isAssigned = classData.assignedTeachers.some(
        assignedTeacher => assignedTeacher.teacherId.toString() === teacherId
      );
    }

    // Also check if teacher is the class head
    if (!isAssigned && classData.classHead && classData.classHead.employeeId) {
      const teacher = await db.collection('teachers').findOne({
        _id: new ObjectId(teacherId)
      });
      if (teacher && teacher.employeeId === classData.classHead.employeeId) {
        isAssigned = true;
      }
    }

    // Check if teacher is in classes array (backward compatibility)
    if (!isAssigned && classData.classes) {
      isAssigned = classData.classes.some(
        classId => classId.toString() === teacherId
      );
    }

    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this class'
      });
    }

    // Attach class to request for use in route handlers
    req.classData = classData;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying teacher class assignment',
      error: error.message
    });
  }
};

// Verify attendance ownership or teacher assignment
const verifyAttendanceOwner = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const recordId = req.params.recordId;
    const db = getDatabase();

    if (!ObjectId.isValid(recordId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid attendance record ID'
      });
    }

    const attendance = await db.collection('attendance').findOne({
      _id: new ObjectId(recordId)
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    // Allow if teacher created the record
    if (attendance.submittedBy && attendance.submittedBy.toString() === teacherId) {
      req.attendance = attendance;
      return next();
    }

    // Check if teacher is assigned to the class
    const classData = await db.collection('classes').findOne({
      _id: attendance.classId,
      isActive: true
    });

    let isAssigned = false;

    if (classData && classData.assignedTeachers) {
      isAssigned = classData.assignedTeachers.some(
        assignedTeacher => assignedTeacher.teacherId.toString() === teacherId
      );
    }

    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this attendance record'
      });
    }

    req.attendance = attendance;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying attendance ownership',
      error: error.message
    });
  }
};

// Verify user is a student
const verifyStudent = (req, res, next) => {
  if (req.user.role !== 'STUDENT') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Student role required.'
    });
  }
  next();
};

// Verify user is a teacher
const verifyTeacher = (req, res, next) => {
  if (req.user.role !== 'TEACHER') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Teacher role required.'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  verifyTeacherClass,
  verifyAttendanceOwner,
  verifyStudent,
  verifyTeacher
};
