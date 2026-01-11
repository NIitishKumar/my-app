const { getDatabase, ObjectId } = require('../db');
const XLSX = require('xlsx');

/**
 * Export Attendance Report (Excel/CSV)
 * GET /api/admin/attendance/export
 */
const exportAttendanceReport = async (req, res) => {
  try {
    const { classId, startDate, endDate, format = 'excel' } = req.query;
    const db = getDatabase();

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'startDate and endDate are required'
        }
      });
    }

    // Build query filter
    const filter = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

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

      // Authorization check for teachers
      if (req.user.role === 'TEACHER') {
        const classData = await db.collection('classes').findOne({
          _id: new ObjectId(classId)
        });

        if (!classData || !classData.assignedTeachers?.some(
          at => at.teacherId.toString() === req.user.id
        )) {
          return res.status(403).json({
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'You are not assigned to this class'
            }
          });
        }
      }

      filter.classId = new ObjectId(classId);
    }

    // Fetch attendance records
    const records = await db.collection('attendance')
      .find(filter)
      .sort({ date: 1, className: 1 })
      .toArray();

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'No attendance records found for the specified criteria'
        }
      });
    }

    // Prepare data for export
    const exportData = [];

    for (const record of records) {
      for (const student of record.students) {
        exportData.push({
          Date: new Date(record.date).toISOString().split('T')[0],
          Class: record.className,
          'Student ID': student.studentIdNumber || 'N/A',
          'Student Name': student.studentName,
          Status: student.status.charAt(0).toUpperCase() + student.status.slice(1),
          Remarks: student.remarks || '',
          'Marked By': record.submittedBy ? record.submittedBy.toString() : 'N/A',
          'Submitted At': new Date(record.submittedAt).toISOString()
        });
      }
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 12 }, // Date
      { wch: 25 }, // Class
      { wch: 12 }, // Student ID
      { wch: 25 }, // Student Name
      { wch: 10 }, // Status
      { wch: 30 }, // Remarks
      { wch: 25 }, // Marked By
      { wch: 20 }  // Submitted At
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

    // Generate filename
    const filename = `attendance_report_${startDate}_to_${endDate}`;

    // Set headers and send response
    if (format === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csv);
    } else {
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
      res.send(buffer);
    }
  } catch (error) {
    console.error('Error exporting attendance report:', error);
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
 * Export Class Statistics Report
 * GET /api/admin/attendance/export/statistics/:classId
 */
const exportClassStatistics = async (req, res) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate, format = 'excel' } = req.query;

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

    // Authorization check for teachers
    if (req.user.role === 'TEACHER') {
      const classData = await db.collection('classes').findOne({
        _id: new ObjectId(classId)
      });

      if (!classData || !classData.assignedTeachers?.some(
        at => at.teacherId.toString() === req.user.id
      )) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You are not assigned to this class'
          }
        });
      }
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

    // Prepare export data
    const exportData = [];

    // Overall summary
    exportData.push({
      Category: 'Overall Statistics',
      Metric: 'Total Days',
      Value: statistics.overall.totalDays.toString()
    });
    exportData.push({
      Category: 'Overall Statistics',
      Metric: 'Present Days',
      Value: statistics.overall.presentDays.toString()
    });
    exportData.push({
      Category: 'Overall Statistics',
      Metric: 'Absent Days',
      Value: statistics.overall.absentDays.toString()
    });
    exportData.push({
      Category: 'Overall Statistics',
      Metric: 'Late Days',
      Value: statistics.overall.lateDays.toString()
    });
    exportData.push({
      Category: 'Overall Statistics',
      Metric: 'Excused Days',
      Value: statistics.overall.excusedDays.toString()
    });
    exportData.push({
      Category: 'Overall Statistics',
      Metric: 'Attendance Rate',
      Value: `${statistics.overall.attendanceRate.toFixed(2)}%`
    });

    exportData.push({}); // Empty row separator

    // Student-wise statistics
    for (const student of statistics.studentStats) {
      exportData.push({
        Category: 'Student Statistics',
        Metric: student.studentName,
        Value: ''
      });
      exportData.push({
        Category: '',
        Metric: 'Total Days',
        Value: student.totalDays.toString()
      });
      exportData.push({
        Category: '',
        Metric: 'Present',
        Value: student.presentDays.toString()
      });
      exportData.push({
        Category: '',
        Metric: 'Absent',
        Value: student.absentDays.toString()
      });
      exportData.push({
        Category: '',
        Metric: 'Late',
        Value: student.lateDays.toString()
      });
      exportData.push({
        Category: '',
        Metric: 'Excused',
        Value: student.excusedDays.toString()
      });
      exportData.push({
        Category: '',
        Metric: 'Attendance Rate',
        Value: `${student.attendanceRate.toFixed(2)}%`
      });
      exportData.push({
        Category: '',
        Metric: 'Trend',
        Value: student.trend.charAt(0).toUpperCase() + student.trend.slice(1)
      });
      exportData.push({}); // Empty row separator
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Statistics');

    // Generate filename
    const filename = `attendance_statistics_${statistics.className}_${startDate || 'all'}_to_${endDate || 'all'}`;

    // Set headers and send response
    if (format === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csv);
    } else {
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
      res.send(buffer);
    }
  } catch (error) {
    console.error('Error exporting class statistics:', error);
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
  exportAttendanceReport,
  exportClassStatistics
};
