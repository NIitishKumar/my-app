const { getDatabase, ObjectId } = require('../db');

// Helper function to calculate attendance statistics
const calculateAttendanceStats = (records) => {
  const stats = {
    totalDays: records.length,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    excusedDays: 0
  };

  records.forEach(record => {
    switch (record.status) {
      case 'present':
        stats.presentDays++;
        break;
      case 'absent':
        stats.absentDays++;
        break;
      case 'late':
        stats.lateDays++;
        break;
      case 'excused':
        stats.excusedDays++;
        break;
    }
  });

  stats.attendanceRate = stats.totalDays > 0
    ? ((stats.presentDays + stats.lateDays + stats.excusedDays) / stats.totalDays) * 100
    : 0;

  return stats;
};

// Helper function to calculate trend
const calculateTrend = (monthlyBreakdown) => {
  if (monthlyBreakdown.length < 2) return 'stable';

  const recent = monthlyBreakdown[monthlyBreakdown.length - 1].attendanceRate;
  const previous = monthlyBreakdown[monthlyBreakdown.length - 2].attendanceRate;

  if (recent > previous + 2) return 'improving';
  if (recent < previous - 2) return 'declining';
  return 'stable';
};

// GET /api/student/attendance - Get student's attendance records
const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const {
      startDate,
      endDate,
      classId,
      status,
      page = 1,
      limit = 50
    } = req.query;

    const db = getDatabase();
    const query = { studentId: new ObjectId(studentId) };

    // Build query filters
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (classId) {
      query.classId = new ObjectId(classId);
    }

    if (status) {
      query.status = status;
    }

    // Get total count for pagination
    const totalRecords = await db.collection('attendance').countDocuments(query);

    // Fetch attendance records with pagination
    const records = await db.collection('attendance')
      .find(query)
      .sort({ date: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .toArray();

    // Get class information for each record
    const classIds = [...new Set(records.map(r => r.classId))];
    const classes = await db.collection('classes')
      .find({ _id: { $in: classIds } })
      .toArray();

    const classMap = new Map(classes.map(c => [c._id.toString(), c.name]));

    // Format records
    const formattedRecords = records.map(record => ({
      id: record._id.toString(),
      date: record.date,
      classId: record.classId.toString(),
      className: classMap.get(record.classId.toString()) || 'N/A',
      status: record.status,
      remarks: record.remarks || '',
      submittedBy: record.submittedBy?.toString() || null,
      submittedAt: record.submittedAt || record.createdAt
    }));

    // Calculate summary statistics
    const allRecords = await db.collection('attendance').find(query).toArray();
    const summary = calculateAttendanceStats(allRecords);

    res.status(200).json({
      success: true,
      data: {
        records: formattedRecords,
        summary,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalRecords / parseInt(limit)),
          totalRecords
        }
      }
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records',
      error: { message: error.message }
    });
  }
};

// GET /api/student/attendance/stats - Get student's attendance statistics
const getStudentAttendanceStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { startDate, endDate, period = 'month' } = req.query;

    const db = getDatabase();
    const query = { studentId: new ObjectId(studentId) };

    // Build date range based on period
    const now = new Date();
    let queryStartDate, queryEndDate;

    if (startDate && endDate) {
      queryStartDate = new Date(startDate);
      queryEndDate = new Date(endDate);
    } else {
      switch (period) {
        case 'week':
          queryStartDate = new Date(now);
          queryStartDate.setDate(now.getDate() - 7);
          queryEndDate = now;
          break;
        case 'month':
          queryStartDate = new Date(now);
          queryStartDate.setMonth(now.getMonth() - 1);
          queryEndDate = now;
          break;
        case 'semester':
          queryStartDate = new Date(now);
          queryStartDate.setMonth(now.getMonth() - 6);
          queryEndDate = now;
          break;
        case 'year':
          queryStartDate = new Date(now);
          queryStartDate.setFullYear(now.getFullYear() - 1);
          queryEndDate = now;
          break;
        default:
          queryStartDate = new Date(now);
          queryStartDate.setMonth(now.getMonth() - 1);
          queryEndDate = now;
      }
    }

    query.date = {
      $gte: queryStartDate,
      $lte: queryEndDate
    };

    // Fetch all records for the period
    const records = await db.collection('attendance').find(query).toArray();

    // Calculate overall statistics
    const overall = calculateAttendanceStats(records);

    // Get monthly breakdown
    const monthlyBreakdown = [];
    const monthlyMap = new Map();

    records.forEach(record => {
      const monthKey = `${record.date.getFullYear()}-${String(record.date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, []);
      }
      monthlyMap.get(monthKey).push(record);
    });

    monthlyMap.forEach((monthRecords, month) => {
      const stats = calculateAttendanceStats(monthRecords);
      monthlyBreakdown.push({
        month,
        ...stats
      });
    });

    monthlyBreakdown.sort((a, b) => a.month.localeCompare(b.month));

    overall.trend = calculateTrend(monthlyBreakdown);

    // Get class-wise breakdown
    const classMap = new Map();
    records.forEach(record => {
      const classId = record.classId.toString();
      if (!classMap.has(classId)) {
        classMap.set(classId, []);
      }
      classMap.get(classId).push(record);
    });

    const classIds = [...classMap.keys()];
    const classes = await db.collection('classes')
      .find({ _id: { $in: classIds.map(id => new ObjectId(id)) } })
      .toArray();

    const classWiseBreakdown = await Promise.all(
      classes.map(async (cls) => {
        const classRecords = classMap.get(cls._id.toString()) || [];
        const stats = calculateAttendanceStats(classRecords);
        return {
          classId: cls._id.toString(),
          className: cls.name,
          ...stats
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        overall,
        monthlyBreakdown,
        classWiseBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching student attendance stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance statistics',
      error: { message: error.message }
    });
  }
};

// GET /api/student/attendance/calendar - Get attendance calendar data
const getStudentAttendanceCalendar = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { year, month, classId } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'Year and month are required'
      });
    }

    const db = getDatabase();
    const query = {
      studentId: new ObjectId(studentId)
    };

    // Build date range for the month
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

    query.date = {
      $gte: startDate,
      $lte: endDate
    };

    if (classId) {
      query.classId = new ObjectId(classId);
    }

    const records = await db.collection('attendance').find(query).toArray();

    // Get class information
    const classIds = [...new Set(records.map(r => r.classId))];
    const classes = await db.collection('classes')
      .find({ _id: { $in: classIds } })
      .toArray();

    const classMap = new Map(classes.map(c => [c._id.toString(), c.name]));

    // Build calendar days
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(parseInt(year), parseInt(month) - 1, day);
      const record = records.find(r =>
        r.date.getDate() === day &&
        r.date.getMonth() === date.getMonth() &&
        r.date.getFullYear() === date.getFullYear()
      );

      days.push({
        date: date.toISOString(),
        status: record ? record.status : 'no_class',
        classId: record ? record.classId.toString() : null,
        className: record ? (classMap.get(record.classId.toString()) || 'N/A') : null,
        remarks: record?.remarks || ''
      });
    }

    res.status(200).json({
      success: true,
      data: {
        year: parseInt(year),
        month: parseInt(month),
        days
      }
    });
  } catch (error) {
    console.error('Error fetching attendance calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance calendar',
      error: { message: error.message }
    });
  }
};

// GET /api/student/attendance/export - Export student's attendance report
const exportStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { startDate, endDate, format, classId } = req.query;

    if (!startDate || !endDate || !format) {
      return res.status(400).json({
        success: false,
        message: 'Start date, end date, and format are required'
      });
    }

    const db = getDatabase();
    const query = {
      studentId: new ObjectId(studentId),
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    if (classId) {
      query.classId = new ObjectId(classId);
    }

    const records = await db.collection('attendance')
      .find(query)
      .sort({ date: 1 })
      .toArray();

    // Get student information
    const student = await db.collection('students').findOne({
      _id: new ObjectId(studentId)
    });

    // Get class information
    const classIds = [...new Set(records.map(r => r.classId))];
    const classes = await db.collection('classes')
      .find({ _id: { $in: classIds } })
      .toArray();

    const classMap = new Map(classes.map(c => [c._id.toString(), c.name]));

    // Format records for export
    const exportData = records.map(record => ({
      Date: record.date.toISOString().split('T')[0],
      Class: classMap.get(record.classId.toString()) || 'N/A',
      Status: record.status,
      Remarks: record.remarks || ''
    }));

    // Send file based on format
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=attendance_${student.studentId}_${startDate}_${endDate}.csv`);

      // Convert to CSV
      const csv = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).join(','))
      ].join('\n');

      return res.send(csv);
    }

    // For other formats, return JSON (PDF/Excel would require additional libraries)
    res.status(200).json({
      success: true,
      data: {
        student: {
          name: `${student.firstName} ${student.lastName}`,
          studentId: student.studentId
        },
        records: exportData
      }
    });
  } catch (error) {
    console.error('Error exporting attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting attendance report',
      error: { message: error.message }
    });
  }
};

module.exports = {
  getStudentAttendance,
  getStudentAttendanceStats,
  getStudentAttendanceCalendar,
  exportStudentAttendance
};
