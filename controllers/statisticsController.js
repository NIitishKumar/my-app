const { getDatabase, ObjectId } = require('../db');
const { calculateClassStatistics, getStudentAttendanceHistory } = require('../utils/attendanceUtils');

/**
 * Get Class Attendance Statistics
 * GET /api/attendance/classes/:classId/statistics
 */
const getClassStatistics = async (req, res) => {
  try {
    const { classId } = req.params;
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

    // Check if class exists
    const classData = await db.collection('classes').findOne({
      _id: new ObjectId(classId),
      isActive: true
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Class not found'
        }
      });
    }

    // Authorization check for teachers
    if (req.user.role === 'TEACHER') {
      const isAssigned = classData.assignedTeachers?.some(
        at => at.teacherId.toString() === req.user.id
      );

      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You are not assigned to this class'
          }
        });
      }
    }

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

/**
 * Get Student Attendance History
 * GET /api/attendance/students/:studentId
 */
const getStudentHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { classId, startDate, endDate } = req.query;

    if (!ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid student ID'
        }
      });
    }

    const db = getDatabase();

    // Check if student exists
    const student = await db.collection('students').findOne({
      _id: new ObjectId(studentId)
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Student not found'
        }
      });
    }

    // Authorization: Teachers can only view students in their classes
    if (req.user.role === 'TEACHER' && classId) {
      const classData = await db.collection('classes').findOne({
        _id: new ObjectId(classId)
      });

      if (!classData) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Class not found'
          }
        });
      }

      const isAssigned = classData.assignedTeachers?.some(
        at => at.teacherId.toString() === req.user.id
      );

      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You are not assigned to this class'
          }
        });
      }
    }

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const classFilter = classId ? new ObjectId(classId) : null;

    const history = await getStudentAttendanceHistory(
      db,
      new ObjectId(studentId),
      classFilter,
      start,
      end
    );

    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching student history:', error);
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
 * Get Daily Attendance Report
 * GET /api/attendance/reports/daily
 */
const getDailyAttendanceReport = async (req, res) => {
  try {
    const { date } = req.query;
    const db = getDatabase();

    // Default to today if no date provided
    const queryDate = date ? new Date(date) : new Date();

    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all attendance for the day
    const attendanceRecords = await db.collection('attendance')
      .find({
        date: { $gte: startOfDay, $lte: endOfDay }
      })
      .toArray();

    // Calculate statistics
    let totalStudents = 0;
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    const classBreakdown = [];

    for (const record of attendanceRecords) {
      totalStudents += record.students.length;

      record.students.forEach(student => {
        switch (student.status) {
          case 'present':
            present++;
            break;
          case 'absent':
            absent++;
            break;
          case 'late':
            late++;
            break;
          case 'excused':
            excused++;
            break;
        }
      });

      // Class breakdown
      const classPresent = record.students.filter(s => s.status === 'present').length;
      const classAbsent = record.students.filter(s => s.status === 'absent').length;
      const classLate = record.students.filter(s => s.status === 'late').length;
      const classExcused = record.students.filter(s => s.status === 'excused').length;

      classBreakdown.push({
        classId: record.classId.toString(),
        className: record.className,
        totalStudents: record.students.length,
        present: classPresent,
        absent: classAbsent,
        late: classLate,
        excused: classExcused,
        attendanceRate: ((classPresent + classLate) / record.students.length) * 100
      });
    }

    const report = {
      date: startOfDay.toISOString().split('T')[0],
      summary: {
        totalClasses: attendanceRecords.length,
        totalStudents,
        present,
        absent,
        late,
        excused,
        attendanceRate: totalStudents > 0
          ? ((present + late) / totalStudents) * 100
          : 0
      },
      classBreakdown
    };

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating daily report:', error);
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
 * Get Attendance Trends
 * GET /api/attendance/reports/trends
 */
const getAttendanceTrends = async (req, res) => {
  try {
    const { classId, startDate, endDate, granularity = 'daily' } = req.query;
    const db = getDatabase();

    const matchStage = {};
    if (classId) {
      matchStage.classId = new ObjectId(classId);
    }

    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    // Determine grouping based on granularity
    let dateFormat;
    switch (granularity) {
      case 'daily':
        dateFormat = '%Y-%m-%d';
        break;
      case 'weekly':
        dateFormat = '%Y-%U';
        break;
      case 'monthly':
        dateFormat = '%Y-%m';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }

    const pipeline = [
      { $match: matchStage },
      { $unwind: '$students' },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: dateFormat, date: '$date' } },
            status: '$students.status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          data: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          },
          total: { $sum: '$count' }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const trends = await db.collection('attendance').aggregate(pipeline).toArray();

    const formattedTrends = trends.map(trend => {
      const dataPoint = {
        date: trend._id,
        total: trend.total
      };

      trend.data.forEach(d => {
        dataPoint[d.status] = d.count;
      });

      // Ensure all status fields exist
      dataPoint.present = dataPoint.present || 0;
      dataPoint.absent = dataPoint.absent || 0;
      dataPoint.late = dataPoint.late || 0;
      dataPoint.excused = dataPoint.excused || 0;

      return dataPoint;
    });

    res.status(200).json({
      success: true,
      data: {
        granularity,
        trends: formattedTrends
      }
    });
  } catch (error) {
    console.error('Error fetching attendance trends:', error);
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
  getClassStatistics,
  getStudentHistory,
  getDailyAttendanceReport,
  getAttendanceTrends
};
