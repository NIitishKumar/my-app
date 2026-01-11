const { ObjectId } = require('../db');

/**
 * Calculate attendance rate for a class
 * @param {Object} db - Database instance
 * @param {ObjectId} classId - Class ID
 * @param {Date} startDate - Start date (optional)
 * @param {Date} endDate - End date (optional)
 * @returns {Number} Attendance rate percentage
 */
const calculateAttendanceRate = async (db, classId, startDate = null, endDate = null) => {
  const matchStage = { classId: new ObjectId(classId) };

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }

  const pipeline = [
    { $match: matchStage },
    { $unwind: '$students' },
    {
      $group: {
        _id: null,
        totalDays: { $sum: 1 },
        presentDays: {
          $sum: {
            $cond: [
              { $in: ['$students.status', ['present', 'late']] },
              1,
              0
            ]
          }
        }
      }
    }
  ];

  const result = await db.collection('attendance').aggregate(pipeline).toArray();

  if (result.length === 0 || result[0].totalDays === 0) return null;

  return (result[0].presentDays / result[0].totalDays) * 100;
};

/**
 * Calculate attendance statistics for a class
 * @param {Object} db - Database instance
 * @param {ObjectId} classId - Class ID
 * @param {Date} startDate - Start date (optional)
 * @param {Date} endDate - End date (optional)
 * @returns {Object} Statistics object
 */
const calculateClassStatistics = async (db, classId, startDate = null, endDate = null) => {
  const matchStage = { classId: new ObjectId(classId) };

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }

  // Get class data
  const classData = await db.collection('classes').findOne({
    _id: new ObjectId(classId)
  });

  if (!classData) {
    throw new Error('Class not found');
  }

  // Overall statistics
  const overallPipeline = [
    { $match: matchStage },
    { $unwind: '$students' },
    {
      $group: {
        _id: null,
        totalDays: { $sum: 1 },
        presentDays: {
          $sum: { $cond: [{ $eq: ['$students.status', 'present'] }, 1, 0] }
        },
        absentDays: {
          $sum: { $cond: [{ $eq: ['$students.status', 'absent'] }, 1, 0] }
        },
        lateDays: {
          $sum: { $cond: [{ $eq: ['$students.status', 'late'] }, 1, 0] }
        },
        excusedDays: {
          $sum: { $cond: [{ $eq: ['$students.status', 'excused'] }, 1, 0] }
        }
      }
    }
  ];

  const overallResult = await db.collection('attendance').aggregate(overallPipeline).toArray();
  const overall = overallResult.length > 0 ? overallResult[0] : {
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    excusedDays: 0
  };

  overall.attendanceRate = overall.totalDays > 0
    ? ((overall.presentDays + overall.lateDays) / overall.totalDays) * 100
    : 0;

  // Student-wise statistics
  const studentStatsPipeline = [
    { $match: matchStage },
    { $unwind: '$students' },
    {
      $group: {
        _id: {
          studentId: '$students.studentId',
          studentName: '$students.studentName'
        },
        totalDays: { $sum: 1 },
        presentDays: {
          $sum: { $cond: [{ $eq: ['$students.status', 'present'] }, 1, 0] }
        },
        absentDays: {
          $sum: { $cond: [{ $eq: ['$students.status', 'absent'] }, 1, 0] }
        },
        lateDays: {
          $sum: { $cond: [{ $eq: ['$students.status', 'late'] }, 1, 0] }
        },
        excusedDays: {
          $sum: { $cond: [{ $eq: ['$students.status', 'excused'] }, 1, 0] }
        },
        dates: { $push: '$date' }
      }
    },
    {
      $project: {
        studentId: '$_id.studentId',
        studentName: '$_id.studentName',
        totalDays: 1,
        presentDays: 1,
        absentDays: 1,
        lateDays: 1,
        excusedDays: 1,
        attendanceRate: {
          $multiply: [
            {
              $divide: [
                { $add: ['$presentDays', '$lateDays'] },
                '$totalDays'
              ]
            },
            100
          ]
        },
        dates: 1
      }
    },
    { $sort: { studentName: 1 } }
  ];

  const studentStats = await db.collection('attendance').aggregate(studentStatsPipeline).toArray();

  // Calculate trend for each student
  for (const student of studentStats) {
    student.trend = calculateStudentTrend(student.dates);
    delete student.dates;
  }

  // Daily breakdown
  const dailyBreakdownPipeline = [
    { $match: matchStage },
    { $unwind: '$students' },
    {
      $group: {
        _id: '$date',
        present: {
          $sum: { $cond: [{ $eq: ['$students.status', 'present'] }, 1, 0] }
        },
        absent: {
          $sum: { $cond: [{ $eq: ['$students.status', 'absent'] }, 1, 0] }
        },
        late: {
          $sum: { $cond: [{ $eq: ['$students.status', 'late'] }, 1, 0] }
        },
        excused: {
          $sum: { $cond: [{ $eq: ['$students.status', 'excused'] }, 1, 0] }
        }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: '$_id',
        present: 1,
        absent: 1,
        late: 1,
        excused: 1,
        _id: 0
      }
    }
  ];

  const dailyBreakdown = await db.collection('attendance').aggregate(dailyBreakdownPipeline).toArray();

  return {
    classId: classId.toString(),
    className: classData.className,
    period: {
      startDate: startDate ? startDate.toISOString().split('T')[0] : null,
      endDate: endDate ? endDate.toISOString().split('T')[0] : null
    },
    overall,
    studentStats,
    dailyBreakdown
  };
};

/**
 * Calculate student attendance trend
 * @param {Array} dates - Array of attendance dates
 * @returns {String} Trend: 'improving', 'declining', or 'stable'
 */
const calculateStudentTrend = (dates) => {
  if (dates.length < 14) return 'stable';

  // Sort dates
  dates.sort((a, b) => new Date(a) - new Date(b));

  // Split into recent and previous periods (last 7 days vs previous 7 days)
  const midPoint = Math.floor(dates.length / 2);
  const recentDates = dates.slice(-7);
  const previousDates = dates.slice(midPoint - 7, midPoint);

  // Calculate attendance rate for each period
  const recentRate = recentDates.length; // Simplified - in real case would count present/late
  const previousRate = previousDates.length;

  const threshold = 0.1; // 10% threshold

  if (recentRate > previousRate * (1 + threshold)) {
    return 'improving';
  } else if (recentRate < previousRate * (1 - threshold)) {
    return 'declining';
  } else {
    return 'stable';
  }
};

/**
 * Get student attendance history
 * @param {Object} db - Database instance
 * @param {ObjectId} studentId - Student ID
 * @param {ObjectId} classId - Class ID (optional)
 * @param {Date} startDate - Start date (optional)
 * @param {Date} endDate - End date (optional)
 * @returns {Object} Student attendance history
 */
const getStudentAttendanceHistory = async (db, studentId, classId = null, startDate = null, endDate = null) => {
  const matchStage = { 'students.studentId': new ObjectId(studentId) };

  if (classId) {
    matchStage.classId = new ObjectId(classId);
  }

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }

  const pipeline = [
    { $match: matchStage },
    { $unwind: '$students' },
    { $match: { 'students.studentId': new ObjectId(studentId) } },
    {
      $project: {
        date: 1,
        classId: 1,
        className: 1,
        status: '$students.status',
        remarks: '$students.remarks',
        submittedBy: 1,
        submittedAt: 1
      }
    },
    { $sort: { date: -1 } }
  ];

  const records = await db.collection('attendance').aggregate(pipeline).toArray();

  // Calculate summary
  const summary = {
    totalDays: records.length,
    presentDays: records.filter(r => r.status === 'present').length,
    absentDays: records.filter(r => r.status === 'absent').length,
    lateDays: records.filter(r => r.status === 'late').length,
    excusedDays: records.filter(r => r.status === 'excused').length
  };

  summary.attendanceRate = summary.totalDays > 0
    ? ((summary.presentDays + summary.lateDays) / summary.totalDays) * 100
    : 0;

  // Get student details
  const student = await db.collection('students').findOne({
    _id: new ObjectId(studentId)
  });

  return {
    studentId: studentId.toString(),
    studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
    records,
    summary
  };
};

/**
 * Get last attendance date for a class
 * @param {Object} db - Database instance
 * @param {ObjectId} classId - Class ID
 * @returns {Date|null} Last attendance date or null
 */
const getLastAttendanceDate = async (db, classId) => {
  const lastRecord = await db.collection('attendance')
    .find({
      classId: new ObjectId(classId)
    })
    .sort({ date: -1 })
    .limit(1)
    .toArray();

  return lastRecord.length > 0 ? lastRecord[0].date : null;
};

/**
 * Get pending attendance for a teacher
 * @param {Object} db - Database instance
 * @param {ObjectId} teacherId - Teacher ID
 * @param {Date} date - Date to check (default: today)
 * @returns {Array} Classes without attendance for the date
 */
const getPendingAttendance = async (db, teacherId, date = new Date()) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Get all classes assigned to teacher
  const classes = await db.collection('classes')
    .find({
      isActive: true,
      'assignedTeachers.teacherId': new ObjectId(teacherId)
    })
    .toArray();

  // Get classes that already have attendance for this date
  const attendedClassIds = await db.collection('attendance')
    .find({
      date: { $gte: startOfDay, $lte: endOfDay },
      classId: { $in: classes.map(c => c._id) }
    })
    .project({ classId: 1 })
    .toArray();

  const attendedIds = attendedClassIds.map(a => a.classId.toString());

  // Filter classes that don't have attendance
  return classes.filter(c => !attendedIds.includes(c._id.toString()));
};

/**
 * Get recent activity for a teacher
 * @param {Object} db - Database instance
 * @param {ObjectId} teacherId - Teacher ID
 * @param {Number} limit - Number of records to return
 * @returns {Array} Recent attendance records
 */
const getRecentActivity = async (db, teacherId, limit = 5) => {
  const records = await db.collection('attendance')
    .find({
      submittedBy: new ObjectId(teacherId)
    })
    .sort({ submittedAt: -1 })
    .limit(limit)
    .project({
      classId: 1,
      className: 1,
      date: 1,
      'students': { $slice: ['$students', 1] } // Just get count
    })
    .toArray();

  return records.map(record => ({
    classId: record.classId.toString(),
    className: record.className,
    date: record.date,
    studentsCount: record.students.length,
    markedAt: record.submittedAt
  }));
};

module.exports = {
  calculateAttendanceRate,
  calculateClassStatistics,
  calculateStudentTrend,
  getStudentAttendanceHistory,
  getLastAttendanceDate,
  getPendingAttendance,
  getRecentActivity
};
