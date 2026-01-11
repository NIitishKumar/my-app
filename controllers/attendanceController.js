const { getDatabase, ObjectId } = require('../db');
const {
  isValidStatus,
  isValidDateFormat,
  isFutureDate,
  isTooOldForUpdate,
  isTooOldForDeletion
} = require('../schemas/attendanceSchema');

// Get all attendance records for a class with optional filters
const getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { start_date, end_date, lecture_id, status } = req.query;
    const db = getDatabase();

    if (!ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class ID'
      });
    }

    // Build query filter
    const filter = { classId: new ObjectId(classId) };

    // Date range filter
    if (start_date || end_date) {
      filter.date = {};
      if (start_date && isValidDateFormat(start_date)) {
        filter.date.$gte = new Date(start_date);
      }
      if (end_date && isValidDateFormat(end_date)) {
        const endDate = new Date(end_date);
        endDate.setHours(23, 59, 59, 999);
        filter.date.$lte = endDate;
      }
    }

    // Lecture filter
    if (lecture_id && ObjectId.isValid(lecture_id)) {
      filter.lectureId = new ObjectId(lecture_id);
    }

    // Status filter (filter records where at least one student has this status)
    const attendanceRecords = await db.collection('attendance')
      .find(filter)
      .sort({ date: -1 })
      .toArray();

    // If status filter is applied, filter students array
    let filteredRecords = attendanceRecords;
    if (status && isValidStatus(status)) {
      filteredRecords = attendanceRecords.map(record => ({
        ...record,
        students: record.students.filter(student => student.status === status)
      })).filter(record => record.students.length > 0);
    }

    res.status(200).json({
      success: true,
      count: filteredRecords.length,
      data: filteredRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records',
      error: error.message
    });
  }
};

// Get attendance for a specific date
const getAttendanceByDate = async (req, res) => {
  try {
    const { classId, date } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class ID'
      });
    }

    if (!isValidDateFormat(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    const attendance = await db.collection('attendance')
      .find({
        classId: new ObjectId(classId),
        date: new Date(date)
      })
      .toArray();

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance by date',
      error: error.message
    });
  }
};

// Get attendance for a specific lecture
const getAttendanceByLecture = async (req, res) => {
  try {
    const { classId, lectureId } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(classId) || !ObjectId.isValid(lectureId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class ID or lecture ID'
      });
    }

    const attendanceRecords = await db.collection('attendance')
      .find({
        classId: new ObjectId(classId),
        lectureId: new ObjectId(lectureId)
      })
      .sort({ date: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: attendanceRecords.length,
      data: attendanceRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance by lecture',
      error: error.message
    });
  }
};

// Create new attendance record
const createAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date, lecture_id, students } = req.body;
    const db = getDatabase();

    if (!ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class ID'
      });
    }

    // Validate required fields
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required (YYYY-MM-DD format)'
      });
    }

    if (!isValidDateFormat(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    if (isFutureDate(date)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark attendance for future dates'
      });
    }

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Students array is required and must have at least one student'
      });
    }

    // Validate class exists
    const classData = await db.collection('classes').findOne({
      _id: new ObjectId(classId)
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Validate lecture if provided
    let lectureTitle = null;
    if (lecture_id) {
      if (!ObjectId.isValid(lecture_id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid lecture ID'
        });
      }

      const lecture = await db.collection('lectures').findOne({
        _id: new ObjectId(lecture_id)
      });

      if (!lecture) {
        return res.status(404).json({
          success: false,
          message: 'Lecture not found'
        });
      }

      // Check if lecture is assigned to this class
      if (lecture.classId && lecture.classId.toString() !== classId) {
        return res.status(400).json({
          success: false,
          message: 'Lecture is not assigned to this class'
        });
      }

      lectureTitle = lecture.title;
    }

    // Validate students and populate names
    const validatedStudents = [];
    for (const student of students) {
      if (!student.student_id) {
        return res.status(400).json({
          success: false,
          message: 'Each student must have student_id'
        });
      }

      if (!isValidStatus(student.status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status for student ${student.student_id}. Must be: present, absent, late, or excused`
        });
      }

      if (!ObjectId.isValid(student.student_id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid student ID: ${student.student_id}`
        });
      }

      // Check if student exists and is enrolled in this class
      const studentData = await db.collection('students').findOne({
        _id: new ObjectId(student.student_id)
      });

      if (!studentData) {
        return res.status(404).json({
          success: false,
          message: `Student not found: ${student.student_id}`
        });
      }

      // Check if student is enrolled in this class
      const classStudents = classData.students || [];
      const isEnrolled = classStudents.some(s =>
        s.toString() === student.student_id
      );

      if (!isEnrolled) {
        return res.status(400).json({
          success: false,
          message: `Student ${studentData.firstName} ${studentData.lastName} is not enrolled in this class`
        });
      }

      validatedStudents.push({
        studentId: new ObjectId(student.student_id),
        studentName: `${studentData.firstName} ${studentData.lastName}`,
        studentIdNumber: studentData.studentId || null,
        status: student.status,
        remarks: student.remarks || null,
        markedAt: new Date(),
        markedBy: new ObjectId(req.user.id)
      });
    }

    // Check for duplicate attendance (same class, same date, same lecture or no lecture)
    const duplicateFilter = {
      classId: new ObjectId(classId),
      date: new Date(date)
    };

    if (lecture_id) {
      duplicateFilter.lectureId = new ObjectId(lecture_id);
    } else {
      duplicateFilter.lectureId = { $exists: false };
    }

    const existingAttendance = await db.collection('attendance').findOne(duplicateFilter);

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already exists for this class, date, and lecture'
      });
    }

    // Create attendance record
    const attendanceData = {
      classId: new ObjectId(classId),
      className: classData.className,
      date: new Date(date),
      type: lecture_id ? 'lecture' : 'date',
      students: validatedStudents,
      submittedBy: new ObjectId(req.user.id), // Use authenticated user ID
      submittedAt: new Date(),
      isLocked: false,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (lecture_id) {
      attendanceData.lectureId = new ObjectId(lecture_id);
      attendanceData.lectureTitle = lectureTitle;
    }

    const result = await db.collection('attendance').insertOne(attendanceData);

    res.status(201).json({
      success: true,
      message: 'Attendance record created successfully',
      data: {
        _id: result.insertedId,
        ...attendanceData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error creating attendance record',
        details: error.message
      }
    });
  }
};

// Update attendance record
const updateAttendance = async (req, res) => {
  try {
    const { classId, recordId } = req.params;
    const { date, students, version } = req.body;
    const db = getDatabase();

    if (!ObjectId.isValid(classId) || !ObjectId.isValid(recordId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid class ID or record ID'
        }
      });
    }

    // Check if attendance record exists
    const existingAttendance = await db.collection('attendance').findOne({
      _id: new ObjectId(recordId),
      classId: new ObjectId(classId)
    });

    if (!existingAttendance) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Attendance record not found'
        }
      });
    }

    // Check if record is locked
    if (existingAttendance.isLocked) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Cannot update locked attendance record'
        }
      });
    }

    // Check if date is too old for update (30 days)
    const attendanceDate = new Date(existingAttendance.date);
    if (isTooOldForUpdate(attendanceDate)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Cannot update attendance records older than 30 days'
        }
      });
    }

    // Optimistic locking: Check version
    if (version !== undefined && existingAttendance.version !== version) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'VERSION_CONFLICT',
          message: 'Record was modified by another user. Please refresh and try again.'
        }
      });
    }

    // Authorization: Only original submitter or admin can update
    if (req.user.role !== 'ADMIN' &&
        existingAttendance.submittedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You can only update attendance records you submitted'
        }
      });
    }

    // Validate students if provided
    let validatedStudents = existingAttendance.students;
    if (students && Array.isArray(students) && students.length > 0) {
      const classData = await db.collection('classes').findOne({
        _id: new ObjectId(classId)
      });

      validatedStudents = [];
      for (const student of students) {
        if (!isValidStatus(student.status)) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: `Invalid status. Must be: present, absent, late, or excused`
            }
          });
        }

        // Get student name
        const studentData = await db.collection('students').findOne({
          _id: new ObjectId(student.student_id)
        });

        validatedStudents.push({
          studentId: new ObjectId(student.student_id),
          studentName: studentData ?
            `${studentData.firstName} ${studentData.lastName}` :
            existingAttendance.students.find(s => s.studentId.toString() === student.student_id)?.studentName || 'Unknown',
          studentIdNumber: studentData?.studentId || null,
          status: student.status,
          remarks: student.remarks || null,
          markedAt: new Date(),
          markedBy: new ObjectId(req.user.id)
        });
      }
    }

    // Build update data
    const updateData = {
      students: validatedStudents,
      version: existingAttendance.version + 1,
      updatedAt: new Date()
    };

    if (date) {
      if (!isValidDateFormat(date)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid date format. Use YYYY-MM-DD'
          }
        });
      }

      if (isFutureDate(date)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Cannot set attendance date to future'
          }
        });
      }

      updateData.date = new Date(date);
    }

    const result = await db.collection('attendance').updateOne(
      { _id: new ObjectId(recordId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Attendance record not found'
        }
      });
    }

    // Get updated record
    const updatedRecord = await db.collection('attendance').findOne({
      _id: new ObjectId(recordId)
    });

    res.status(200).json({
      success: true,
      message: 'Attendance record updated successfully',
      data: updatedRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error updating attendance record',
        details: error.message
      }
    });
  }
};

// Delete attendance record
const deleteAttendance = async (req, res) => {
  try {
    const { classId, recordId } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(classId) || !ObjectId.isValid(recordId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid class ID or record ID'
        }
      });
    }

    // Get the record first to check permissions
    const record = await db.collection('attendance').findOne({
      _id: new ObjectId(recordId),
      classId: new ObjectId(classId)
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

    // Check if record is locked
    if (record.isLocked) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Cannot delete locked attendance record'
        }
      });
    }

    // Check if date is too old for deletion (7 days)
    const attendanceDate = new Date(record.date);
    if (isTooOldForDeletion(attendanceDate)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Cannot delete attendance records older than 7 days'
        }
      });
    }

    // Authorization: Teachers can only delete if submitted in last 24 hours
    if (req.user.role === 'TEACHER') {
      // Check if teacher is the original submitter
      if (record.submittedBy.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You can only delete attendance records you submitted'
          }
        });
      }

      // Check if submitted within last 24 hours
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      if (new Date(record.submittedAt) < twentyFourHoursAgo) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Teachers can only delete attendance records within 24 hours of submission'
          }
        });
      }
    }

    const result = await db.collection('attendance').deleteOne({
      _id: new ObjectId(recordId),
      classId: new ObjectId(classId)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Attendance record not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error deleting attendance record',
        details: error.message
      }
    });
  }
};

module.exports = {
  getClassAttendance,
  getAttendanceByDate,
  getAttendanceByLecture,
  createAttendance,
  updateAttendance,
  deleteAttendance
};
