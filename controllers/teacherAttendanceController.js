const { getDatabase, ObjectId } = require('../db');
const {
  getPendingAttendance,
  getRecentActivity,
  calculateAttendanceRate
} = require('../utils/attendanceUtils');

/**
 * Get Teacher's Attendance Dashboard
 * GET /api/teacher/attendance/dashboard
 */
const getTeacherAttendanceDashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { startDate, endDate } = req.query;
    const db = getDatabase();

    // Get all classes assigned to teacher
    const classes = await db.collection('classes')
      .find({
        isActive: true,
        'assignedTeachers.teacherId': new ObjectId(teacherId)
      })
      .project({
        className: 1,
        grade: 1,
        schedule: 1,
        subjects: 1
      })
      .toArray();

    const totalClasses = classes.length;

    // Get pending attendance for today
    const today = new Date();
    const pendingClasses = await getPendingAttendance(db, new ObjectId(teacherId), today);
    const pendingAttendance = pendingClasses.length;

    // Get today's attendance count
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const todayAttendance = await db.collection('attendance')
      .countDocuments({
        submittedBy: new ObjectId(teacherId),
        submittedAt: { $gte: startOfDay, $lte: endOfDay }
      });

    // Get recent activity (last 5)
    const recentActivity = await getRecentActivity(db, new ObjectId(teacherId), 5);

    // Get upcoming classes (for next 7 days)
    const upcomingClasses = [];
    const classIds = classes.map(c => c._id);

    // Get lectures for these classes scheduled in next 7 days
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const lectures = await db.collection('lectures')
      .find({
        classId: { $in: classIds },
        isActive: true
      })
      .project({
        title: 1,
        classId: 1,
        schedule: 1
      })
      .toArray();

    // Check if attendance exists for these lectures
    for (const lecture of lectures) {
      const classData = classes.find(c => c._id.toString() === lecture.classId.toString());
      if (!classData) continue;

      const hasAttendance = await db.collection('attendance')
        .findOne({
          classId: lecture.classId,
          lectureId: lecture._id
        });

      upcomingClasses.push({
        classId: classData._id.toString(),
        className: classData.className,
        scheduledTime: lecture.schedule?.startTime || 'TBD',
        hasAttendance: !!hasAttendance
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalClasses,
        pendingAttendance,
        todayAttendance,
        recentActivity,
        upcomingClasses: upcomingClasses.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Error fetching teacher dashboard:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details: error.message
      }
    });
  }
};

/**
 * Get All Attendance Records for Teacher's Classes
 * GET /api/teacher/attendance
 */
const getTeacherAttendanceRecords = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const {
      classId,
      startDate,
      endDate,
      lectureId,
      status,
      page = 1,
      limit = 20
    } = req.query;

    const db = getDatabase();
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query filter
    const filter = { submittedBy: new ObjectId(teacherId) };

    if (classId) {
      if (!ObjectId.isValid(classId)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid class ID'
          }
        });
      }

      // Verify teacher is assigned to this class
      const classData = await db.collection('classes').findOne({
        _id: new ObjectId(classId),
        'assignedTeachers.teacherId': new ObjectId(teacherId)
      });

      if (!classData) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You are not assigned to this class'
          }
        });
      }

      filter.classId = new ObjectId(classId);
    } else {
      // If no class specified, get all teacher's classes
      const teacherClasses = await db.collection('classes')
        .find({
          'assignedTeachers.teacherId': new ObjectId(teacherId)
        })
        .project({ _id: 1 })
        .toArray();

      const classIds = teacherClasses.map(c => c._id);
      filter.classId = { $in: classIds };
    }

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Lecture filter
    if (lectureId && ObjectId.isValid(lectureId)) {
      filter.lectureId = new ObjectId(lectureId);
    }

    // Get total count for pagination
    const totalCount = await db.collection('attendance').countDocuments(filter);

    // Fetch records
    let records = await db.collection('attendance')
      .find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    // Filter by status if provided (after fetching)
    if (status) {
      records = records.filter(record =>
        record.students.some(student => student.status === status)
      );
    }

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      count: records.length,
      page: parseInt(page),
      totalPages,
      data: records
    });
  } catch (error) {
    console.error('Error fetching teacher attendance records:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details: error.message
      }
    });
  }
};

/**
 * Get Attendance Statistics for Teacher's Class
 * GET /api/teacher/attendance/statistics/:classId
 */
const getTeacherClassStatistics = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user.id;
    const { startDate, endDate } = req.query;

    if (!ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid class ID'
        }
      });
    }

    const db = getDatabase();

    // Verify teacher is assigned to this class
    const classData = await db.collection('classes').findOne({
      _id: new ObjectId(classId),
      'assignedTeachers.teacherId': new ObjectId(teacherId)
    });

    if (!classData) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You are not assigned to this class'
        }
      });
    }

    const { calculateClassStatistics } = require('../utils/attendanceUtils');

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const statistics = await calculateClassStatistics(
      db,
      new ObjectId(classId),
      start,
      end
    );

    res.status(200).json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Error fetching class statistics:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details: error.message
      }
    });
  }
};

module.exports = {
  getTeacherAttendanceDashboard,
  getTeacherAttendanceRecords,
  getTeacherClassStatistics
};
