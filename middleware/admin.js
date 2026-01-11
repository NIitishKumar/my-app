const { getDatabase, ObjectId } = require('../db');

/**
 * Middleware to verify if user has admin role
 */
const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Admin access required'
        }
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};

/**
 * Middleware to verify if user is teacher or admin
 */
const verifyTeacherOrAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    if (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Teacher or Admin access required'
        }
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};

/**
 * Middleware to verify attendance record ownership or admin access
 */
const verifyAttendanceOwnership = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(recordId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid record ID'
        }
      });
    }

    const record = await db.collection('attendance').findOne({
      _id: new ObjectId(recordId)
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Attendance record not found'
        }
      });
    }

    // Admin can access any record
    if (req.user.role === 'ADMIN') {
      req.attendanceRecord = record;
      return next();
    }

    // Teacher can only access records they submitted
    if (req.user.role === 'TEACHER') {
      if (record.submittedBy.toString() === req.user.id) {
        req.attendanceRecord = record;
        return next();
      }

      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this record'
        }
      });
    }

    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Access denied'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};

module.exports = {
  verifyAdmin,
  verifyTeacherOrAdmin,
  verifyAttendanceOwnership
};
