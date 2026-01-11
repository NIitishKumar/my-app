const { getDatabase, ObjectId } = require('../db');
const {
  isValidDateFormat,
  isValidStatus,
  isFutureDate,
  isTooOldForUpdate,
  isTooOldForDeletion
} = require('../schemas/attendanceSchema');

/**
 * Get All Attendance Records (Admin)
 * GET /api/admin/attendance
 */
const getAllAttendanceRecords = async (req, res) => {
  try {
    const {
      classId,
      teacherId,
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
    const filter = {};

    if (classId && ObjectId.isValid(classId)) {
      filter.classId = new ObjectId(classId);
    }

    if (teacherId && ObjectId.isValid(teacherId)) {
      filter.submittedBy = new ObjectId(teacherId);
    }

    if (lectureId && ObjectId.isValid(lectureId)) {
      filter.lectureId = new ObjectId(lectureId);
    }

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
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

    // Filter by status if provided
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
    console.error('Error fetching all attendance records:', error);
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
 * Lock/Unlock Attendance Record
 * PATCH /api/admin/attendance/:recordId/lock
 */
const lockUnlockAttendance = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { isLocked } = req.body;
    const adminId = req.user.id;

    if (!ObjectId.isValid(recordId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid record ID'
        }
      });
    }

    if (typeof isLocked !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'isLocked must be a boolean value'
        }
      });
    }

    const db = getDatabase();

    // Check if record exists
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

    // Update lock status
    const updateData = {
      isLocked,
      updatedAt: new Date()
    };

    if (isLocked) {
      updateData.lockedAt = new Date();
      updateData.lockedBy = new ObjectId(adminId);
    } else {
      updateData.lockedAt = null;
      updateData.lockedBy = null;
    }

    await db.collection('attendance').updateOne(
      { _id: new ObjectId(recordId) },
      { $set: updateData }
    );

    // Get updated record
    const updatedRecord = await db.collection('attendance').findOne({
      _id: new ObjectId(recordId)
    });

    res.status(200).json({
      success: true,
      message: isLocked ? 'Attendance record locked successfully' : 'Attendance record unlocked successfully',
      data: updatedRecord
    });
  } catch (error) {
    console.error('Error locking/unlocking attendance:', error);
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
 * Bulk Import Attendance
 * POST /api/admin/attendance/bulk-import
 */
const bulkImportAttendance = async (req, res) => {
  try {
    const { records } = req.body;
    const adminId = req.user.id;
    const db = getDatabase();

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Records array is required and must have at least one record'
        }
      });
    }

    const results = {
      imported: 0,
      failed: 0,
      errors: []
    };

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      try {
        // Validate required fields
        if (!record.classId || !record.date || !record.students) {
          results.failed++;
          results.errors.push({
            index: i,
            error: 'Missing required fields: classId, date, or students'
          });
          continue;
        }

        if (!ObjectId.isValid(record.classId)) {
          results.failed++;
          results.errors.push({
            index: i,
            error: 'Invalid class ID'
          });
          continue;
        }

        if (!isValidDateFormat(record.date)) {
          results.failed++;
          results.errors.push({
            index: i,
            error: 'Invalid date format. Use YYYY-MM-DD'
          });
          continue;
        }

        if (isFutureDate(record.date)) {
          results.failed++;
          results.errors.push({
            index: i,
            error: 'Cannot mark attendance for future dates'
          });
          continue;
        }

        // Check if class exists
        const classData = await db.collection('classes').findOne({
          _id: new ObjectId(record.classId)
        });

        if (!classData) {
          results.failed++;
          results.errors.push({
            index: i,
            error: 'Class not found'
          });
          continue;
        }

        // Check for duplicate
        const existingAttendance = await db.collection('attendance').findOne({
          classId: new ObjectId(record.classId),
          date: new Date(record.date)
        });

        if (existingAttendance) {
          results.failed++;
          results.errors.push({
            index: i,
            error: 'Attendance already exists for this date'
          });
          continue;
        }

        // Validate and populate students
        const validatedStudents = [];
        for (const student of record.students) {
          if (!student.student_id || !student.status) {
            results.failed++;
            results.errors.push({
              index: i,
              error: 'Each student must have student_id and status'
            });
            continue;
          }

          if (!isValidStatus(student.status)) {
            results.failed++;
            results.errors.push({
              index: i,
              error: `Invalid status: ${student.status}`
            });
            continue;
          }

          if (!ObjectId.isValid(student.student_id)) {
            results.failed++;
            results.errors.push({
              index: i,
              error: `Invalid student ID: ${student.student_id}`
            });
            continue;
          }

          // Get student data
          const studentData = await db.collection('students').findOne({
            _id: new ObjectId(student.student_id)
          });

          if (!studentData) {
            results.failed++;
            results.errors.push({
              index: i,
              error: `Student not found: ${student.student_id}`
            });
            continue;
          }

          validatedStudents.push({
            studentId: studentData._id,
            studentName: `${studentData.firstName} ${studentData.lastName}`,
            studentIdNumber: studentData.studentId || null,
            status: student.status,
            remarks: student.remarks || null,
            markedAt: new Date(),
            markedBy: new ObjectId(adminId)
          });
        }

        if (validatedStudents.length === 0) {
          results.failed++;
          results.errors.push({
            index: i,
            error: 'No valid students found'
          });
          continue;
        }

        // Create attendance record
        const attendanceData = {
          classId: new ObjectId(record.classId),
          className: classData.className,
          date: new Date(record.date),
          type: record.type || 'date',
          students: validatedStudents,
          submittedBy: new ObjectId(adminId),
          submittedAt: new Date(),
          isLocked: false,
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        if (record.lectureId && ObjectId.isValid(record.lectureId)) {
          const lecture = await db.collection('lectures').findOne({
            _id: new ObjectId(record.lectureId)
          });

          if (lecture) {
            attendanceData.lectureId = new ObjectId(record.lectureId);
            attendanceData.lectureTitle = lecture.title;
          }
        }

        await db.collection('attendance').insertOne(attendanceData);
        results.imported++;

      } catch (err) {
        results.failed++;
        results.errors.push({
          index: i,
          error: err.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Bulk import completed: ${results.imported} imported, ${results.failed} failed`,
      data: results
    });
  } catch (error) {
    console.error('Error in bulk import:', error);
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
 * Get All Classes Attendance Summary (Admin Dashboard)
 * GET /api/admin/attendance/summary
 */
const getAttendanceSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const db = getDatabase();

    const matchStage = {};
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    // Overall statistics
    const overallStats = await db.collection('attendance')
      .aggregate([
        { $match: matchStage },
        { $unwind: '$students' },
        {
          $group: {
            _id: null,
            totalRecords: { $sum: 1 },
            totalStudents: { $sum: 1 },
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
        }
      ])
      .toArray();

    // Class-wise statistics
    const classStats = await db.collection('attendance')
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              classId: '$classId',
              className: '$className'
            },
            totalRecords: { $sum: 1 },
            present: {
              $sum: {
                $cond: [
                  { $in: ['$students.status', ['present', 'late']] },
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $project: {
            classId: '$_id.classId',
            className: '$_id.className',
            totalRecords: 1,
            present: 1,
            attendanceRate: {
              $multiply: [{ $divide: ['$present', '$totalRecords'] }, 100]
            },
            _id: 0
          }
        },
        { $sort: { attendanceRate: -1 } }
      ])
      .toArray();

    // Teacher-wise statistics
    const teacherStats = await db.collection('attendance')
      .aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: 'teachers',
            localField: 'submittedBy',
            foreignField: '_id',
            as: 'teacher'
          }
        },
        { $unwind: '$teacher' },
        {
          $group: {
            _id: {
              teacherId: '$submittedBy',
              teacherName: {
                $concat: ['$teacher.firstName', ' ', '$teacher.lastName']
              }
            },
            totalRecords: { $sum: 1 },
            lockedRecords: {
              $sum: { $cond: ['$isLocked', 1, 0] }
            }
          }
        },
        {
          $project: {
            teacherId: '$_id.teacherId',
            teacherName: '$_id.teacherName',
            totalRecords: 1,
            lockedRecords: 1,
            _id: 0
          }
        },
        { $sort: { totalRecords: -1 } }
      ])
      .toArray();

    const summary = {
      overall: overallStats.length > 0 ? overallStats[0] : {
        totalRecords: 0,
        totalStudents: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0
      },
      classStatistics: classStats,
      teacherStatistics: teacherStats
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
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
  getAllAttendanceRecords,
  lockUnlockAttendance,
  bulkImportAttendance,
  getAttendanceSummary
};
