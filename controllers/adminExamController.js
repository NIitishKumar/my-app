const { getDatabase, ObjectId } = require('../db');

// Helper function to calculate end time
const calculateEndTime = (startTime, duration) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

// Helper function to convert time to minutes for comparison
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to check for conflicts
const checkConflicts = async (db, examData, excludeExamId = null) => {
  const conflicts = [];
  const { date, startTime, duration, room, classIds } = examData;

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + duration;

  // Build query to find potential conflicts
  const query = {
    date: new Date(date),
    status: { $in: ['scheduled', 'published'] }
  };

  if (excludeExamId) {
    query._id = { $ne: new ObjectId(excludeExamId) };
  }

  const existingExams = await db.collection('exams').find(query).toArray();

  for (const existingExam of existingExams) {
    const existingStart = timeToMinutes(existingExam.startTime);
    const existingEnd = existingStart + existingExam.duration;

    // Check if time slots overlap
    const timesOverlap = !(endMinutes <= existingStart || startMinutes >= existingEnd);

    if (timesOverlap) {
      // Check for room conflict
      if (room && existingExam.room === room) {
        conflicts.push({
          type: 'room',
          severity: 'high',
          exam: existingExam,
          message: `Room conflict with exam "${existingExam.title}" in ${room}`
        });
      }

      // Check for class overlap
      const overlappingClasses = classIds.filter(classId =>
        existingExam.classIds.some(id => id.toString() === classId.toString())
      );

      if (overlappingClasses.length > 0) {
        conflicts.push({
          type: 'class',
          severity: 'high',
          exam: existingExam,
          overlappingClasses,
          message: `Class conflict with exam "${existingExam.title}"`
        });
      }
    }
  }

  return conflicts;
};

// POST /api/admin/exams - Create new exam
const createExam = async (req, res) => {
  try {
    const {
      title,
      subject,
      subjectCode,
      classIds,
      date,
      startTime,
      duration,
      totalMarks,
      room,
      instructions,
      examType,
      teacherIds
    } = req.body;

    // Validation
    if (!title || !subject || !classIds || !date || !startTime || !duration || !totalMarks || !examType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        error: { message: 'title, subject, classIds, date, startTime, duration, totalMarks, and examType are required' }
      });
    }

    // Validate date is not in the past
    const examDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (examDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot schedule exam in the past',
        error: { message: 'Exam date must be today or in the future' }
      });
    }

    // Validate duration and totalMarks are positive
    if (duration <= 0 || totalMarks <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Duration and total marks must be positive',
        error: { message: 'Duration must be > 0 and totalMarks must be > 0' }
      });
    }

    // Validate at least one class
    if (!Array.isArray(classIds) || classIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one class must be selected',
        error: { message: 'classIds must be a non-empty array' }
      });
    }

    // Validate time format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time format',
        error: { message: 'startTime must be in HH:mm format (24-hour)' }
      });
    }

    const db = getDatabase();

    // Check for conflicts
    const conflicts = await checkConflicts(db, {
      date,
      startTime,
      duration,
      room,
      classIds: classIds.map(id => new ObjectId(id))
    });

    if (conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Exam conflicts detected',
        error: { message: 'Exam conflicts with existing exams', conflicts }
      });
    }

    // Calculate end time
    const endTime = calculateEndTime(startTime, duration);

    // Create exam
    const exam = {
      title,
      subject,
      subjectCode: subjectCode || null,
      classIds: classIds.map(id => new ObjectId(id)),
      date: examDate,
      startTime,
      endTime,
      duration: parseInt(duration),
      totalMarks: parseInt(totalMarks),
      room: room || null,
      instructions: instructions || '',
      examType,
      status: 'scheduled',
      createdBy: new ObjectId(req.user.id),
      teacherIds: teacherIds ? teacherIds.map(id => new ObjectId(id)) : [],
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('exams').insertOne(exam);

    // Fetch created exam with populated data
    const createdExam = await db.collection('exams').findOne({ _id: result.insertedId });

    // Get class information
    const classes = await db.collection('classes')
      .find({ _id: { $in: exam.classIds } })
      .toArray();

    const classMap = new Map(classes.map(c => [c._id.toString(), c.name]));

    // Format response
    const responseExam = {
      id: createdExam._id.toString(),
      title: createdExam.title,
      subject: createdExam.subject,
      subjectCode: createdExam.subjectCode,
      classIds: createdExam.classIds.map(id => id.toString()),
      classNames: createdExam.classIds.map(id => classMap.get(id.toString()) || 'N/A'),
      date: createdExam.date,
      startTime: createdExam.startTime,
      endTime: createdExam.endTime,
      duration: createdExam.duration,
      totalMarks: createdExam.totalMarks,
      room: createdExam.room,
      instructions: createdExam.instructions,
      examType: createdExam.examType,
      status: createdExam.status,
      isPublished: createdExam.isPublished,
      createdBy: createdExam.createdBy.toString(),
      teacherIds: createdExam.teacherIds.map(id => id.toString()),
      createdAt: createdExam.createdAt,
      updatedAt: createdExam.updatedAt
    };

    res.status(201).json({
      success: true,
      data: responseExam,
      message: 'Exam created successfully'
    });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating exam',
      error: { message: error.message }
    });
  }
};

// GET /api/admin/exams - Get all exams with filtering
const getExams = async (req, res) => {
  try {
    const {
      classId,
      subject,
      teacherId,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    const db = getDatabase();
    const query = {};

    // Build filters
    if (classId) {
      query.classIds = new ObjectId(classId);
    }

    if (subject) {
      query.subject = subject;
    }

    if (teacherId) {
      query.teacherIds = new ObjectId(teacherId);
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Get total count
    const totalExams = await db.collection('exams').countDocuments(query);

    // Fetch exams with pagination
    const exams = await db.collection('exams')
      .find(query)
      .sort({ date: 1, startTime: 1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .toArray();

    // Get class information
    const allClassIds = new Set();
    exams.forEach(exam => {
      exam.classIds.forEach(id => allClassIds.add(id.toString()));
    });

    const classes = await db.collection('classes')
      .find({ _id: { $in: Array.from(allClassIds).map(id => new ObjectId(id)) } })
      .toArray();

    const classMap = new Map(classes.map(c => [c._id.toString(), c.name]));

    // Format exams
    const formattedExams = exams.map(exam => ({
      id: exam._id.toString(),
      title: exam.title,
      subject: exam.subject,
      subjectCode: exam.subjectCode,
      classIds: exam.classIds.map(id => id.toString()),
      classNames: exam.classIds.map(id => classMap.get(id.toString()) || 'N/A'),
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      room: exam.room,
      instructions: exam.instructions,
      examType: exam.examType,
      status: exam.status,
      isPublished: exam.isPublished,
      createdBy: exam.createdBy.toString(),
      teacherIds: exam.teacherIds.map(id => id.toString()),
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: {
        exams: formattedExams,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalExams / parseInt(limit)),
          totalRecords: totalExams
        }
      }
    });
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exams',
      error: { message: error.message }
    });
  }
};

// GET /api/admin/exams/:id - Get exam by ID
const getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const exam = await db.collection('exams').findOne({ _id: new ObjectId(id) });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
        error: { message: `No exam found with id: ${id}` }
      });
    }

    // Get class information
    const classes = await db.collection('classes')
      .find({ _id: { $in: exam.classIds } })
      .toArray();

    const classMap = new Map(classes.map(c => [c._id.toString(), c.name]));

    // Get student count from all classes
    const students = await db.collection('students')
      .find({ classes: { $in: exam.classIds } })
      .toArray();

    // Get teacher information
    let teachers = [];
    if (exam.teacherIds && exam.teacherIds.length > 0) {
      teachers = await db.collection('teachers')
        .find({ _id: { $in: exam.teacherIds } })
        .toArray();
    }

    const teacherMap = new Map(teachers.map(t => [t._id.toString(), `${t.firstName} ${t.lastName}`]));

    // Format response
    const responseExam = {
      id: exam._id.toString(),
      title: exam.title,
      subject: exam.subject,
      subjectCode: exam.subjectCode,
      classIds: exam.classIds.map(id => id.toString()),
      classNames: exam.classIds.map(id => classMap.get(id.toString()) || 'N/A'),
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      room: exam.room,
      instructions: exam.instructions,
      examType: exam.examType,
      status: exam.status,
      isPublished: exam.isPublished,
      createdBy: exam.createdBy.toString(),
      teacherIds: exam.teacherIds.map(id => id.toString()),
      teacherNames: exam.teacherIds.map(id => teacherMap.get(id.toString()) || 'N/A'),
      totalStudents: students.length,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
      publishedAt: exam.publishedAt || null,
      cancelledAt: exam.cancelledAt || null
    };

    res.status(200).json({
      success: true,
      data: responseExam
    });
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exam',
      error: { message: error.message }
    });
  }
};

// PUT /api/admin/exams/:id - Update exam
const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const db = getDatabase();

    // Check if exam exists
    const existingExam = await db.collection('exams').findOne({ _id: new ObjectId(id) });

    if (!existingExam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
        error: { message: `No exam found with id: ${id}` }
      });
    }

    // Prevent updates if exam is completed or cancelled
    if (existingExam.status === 'completed' || existingExam.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update completed or cancelled exam',
        error: { message: `Exam is ${existingExam.status} and cannot be modified` }
      });
    }

    // Validate date if provided
    if (updates.date) {
      const examDate = new Date(updates.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (examDate < today) {
        return res.status(400).json({
          success: false,
          message: 'Cannot schedule exam in the past',
          error: { message: 'Exam date must be today or in the future' }
        });
      }
    }

    // Validate duration and totalMarks if provided
    if (updates.duration !== undefined && updates.duration <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be positive',
        error: { message: 'Duration must be > 0' }
      });
    }

    if (updates.totalMarks !== undefined && updates.totalMarks <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Total marks must be positive',
        error: { message: 'totalMarks must be > 0' }
      });
    }

    // Validate time format if provided
    if (updates.startTime) {
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(updates.startTime)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid time format',
          error: { message: 'startTime must be in HH:mm format (24-hour)' }
        });
      }
    }

    // Build update object
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    // Calculate new end time if time or duration changed
    const newStartTime = updates.startTime || existingExam.startTime;
    const newDuration = updates.duration !== undefined ? updates.duration : existingExam.duration;
    updateData.endTime = calculateEndTime(newStartTime, newDuration);

    // Convert classIds and teacherIds to ObjectId if provided
    if (updates.classIds) {
      updateData.classIds = updates.classIds.map(id => new ObjectId(id));
    }

    if (updates.teacherIds) {
      updateData.teacherIds = updates.teacherIds.map(id => new ObjectId(id));
    }

    if (updates.date) {
      updateData.date = new Date(updates.date);
    }

    // Check for conflicts if date, time, room, or classes changed
    const conflictCheckData = {
      date: updateData.date || existingExam.date,
      startTime: updateData.startTime || existingExam.startTime,
      duration: newDuration,
      room: updateData.room !== undefined ? updateData.room : existingExam.room,
      classIds: updateData.classIds || existingExam.classIds
    };

    const conflicts = await checkConflicts(db, conflictCheckData, id);

    if (conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Exam conflicts detected',
        error: { message: 'Updated exam conflicts with existing exams', conflicts }
      });
    }

    // Update exam
    await db.collection('exams').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated exam
    const updatedExam = await db.collection('exams').findOne({ _id: new ObjectId(id) });

    res.status(200).json({
      success: true,
      data: { id: updatedExam._id.toString(), ...updates },
      message: 'Exam updated successfully'
    });
  } catch (error) {
    console.error('Error updating exam:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating exam',
      error: { message: error.message }
    });
  }
};

// DELETE /api/admin/exams/:id - Delete exam
const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    // Check if exam exists
    const exam = await db.collection('exams').findOne({ _id: new ObjectId(id) });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
        error: { message: `No exam found with id: ${id}` }
      });
    }

    // Check if exam has results
    const resultCount = await db.collection('examResults').countDocuments({ examId: new ObjectId(id) });

    if (resultCount > 0) {
      // Soft delete - mark as cancelled
      await db.collection('exams').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: 'cancelled',
            cancelledAt: new Date(),
            cancelledBy: new ObjectId(req.user.id),
            updatedAt: new Date()
          }
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Exam cancelled successfully (results exist, exam was not deleted)',
        data: { resultCount, cancelled: true }
      });
    }

    // Hard delete if no results
    await db.collection('exams').deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting exam',
      error: { message: error.message }
    });
  }
};

// POST /api/admin/exams/bulk - Bulk create exams
const bulkCreateExams = async (req, res) => {
  try {
    const { exams } = req.body;

    if (!Array.isArray(exams) || exams.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request',
        error: { message: 'exams must be a non-empty array' }
      });
    }

    const db = getDatabase();
    const results = {
      created: 0,
      failed: 0,
      errors: []
    };

    for (let i = 0; i < exams.length; i++) {
      const examData = exams[i];

      try {
        // Validation
        if (!examData.title || !examData.subject || !examData.classIds ||
            !examData.date || !examData.startTime || !examData.duration ||
            !examData.totalMarks || !examData.examType) {
          results.failed++;
          results.errors.push({
            row: i + 1,
            error: 'Missing required fields'
          });
          continue;
        }

        // Check for conflicts
        const conflicts = await checkConflicts(db, {
          date: examData.date,
          startTime: examData.startTime,
          duration: examData.duration,
          room: examData.room,
          classIds: examData.classIds.map(id => new ObjectId(id))
        });

        if (conflicts.length > 0) {
          results.failed++;
          results.errors.push({
            row: i + 1,
            error: 'Conflicts detected',
            conflicts: conflicts.map(c => c.message)
          });
          continue;
        }

        // Create exam
        const endTime = calculateEndTime(examData.startTime, examData.duration);

        const exam = {
          title: examData.title,
          subject: examData.subject,
          subjectCode: examData.subjectCode || null,
          classIds: examData.classIds.map(id => new ObjectId(id)),
          date: new Date(examData.date),
          startTime: examData.startTime,
          endTime,
          duration: parseInt(examData.duration),
          totalMarks: parseInt(examData.totalMarks),
          room: examData.room || null,
          instructions: examData.instructions || '',
          examType: examData.examType,
          status: 'scheduled',
          createdBy: new ObjectId(req.user.id),
          teacherIds: examData.teacherIds ? examData.teacherIds.map(id => new ObjectId(id)) : [],
          isPublished: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await db.collection('exams').insertOne(exam);
        results.created++;

      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      message: `Bulk create completed: ${results.created} created, ${results.failed} failed`
    });
  } catch (error) {
    console.error('Error bulk creating exams:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk creating exams',
      error: { message: error.message }
    });
  }
};

// GET /api/admin/exams/dashboard - Get exam dashboard
const getExamDashboard = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const db = getDatabase();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + (7 - today.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    const query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Get statistics
    const totalExams = await db.collection('exams').countDocuments(query);
    const upcomingExams = await db.collection('exams').countDocuments({
      ...query,
      date: { $gte: today },
      status: { $in: ['scheduled', 'published'] }
    });
    const completedExams = await db.collection('exams').countDocuments({
      ...query,
      status: 'completed'
    });

    const todayQuery = {
      date: {
        $gte: today,
        $lte: new Date(new Date(today).setHours(23, 59, 59, 999))
      }
    };

    const todayExams = await db.collection('exams').countDocuments({
      ...query,
      ...todayQuery
    });

    const thisWeekExams = await db.collection('exams').countDocuments({
      ...query,
      date: { $gte: today, $lte: endOfWeek }
    });

    const overview = {
      totalExams,
      upcomingExams,
      completedExams,
      todayExams,
      thisWeekExams
    };

    // Get upcoming exams (limit 10)
    const upcomingExamsList = await db.collection('exams')
      .find({
        date: { $gte: today },
        status: { $in: ['scheduled', 'published'] }
      })
      .sort({ date: 1, startTime: 1 })
      .limit(10)
      .toArray();

    // Format upcoming exams
    const classIds = new Set();
    upcomingExamsList.forEach(exam => {
      exam.classIds.forEach(id => classIds.add(id.toString()));
    });

    const classes = await db.collection('classes')
      .find({ _id: { $in: Array.from(classIds).map(id => new ObjectId(id)) } })
      .toArray();

    const classMap = new Map(classes.map(c => [c._id.toString(), c.name]));

    const formattedUpcoming = upcomingExamsList.map(exam => ({
      id: exam._id.toString(),
      title: exam.title,
      subject: exam.subject,
      classNames: exam.classIds.map(id => classMap.get(id.toString()) || 'N/A').join(', '),
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
      room: exam.room
    }));

    // Get conflicts - check for overlapping exams
    const allExams = await db.collection('exams')
      .find({ status: { $in: ['scheduled', 'published'] } })
      .toArray();

    const conflicts = [];

    for (let i = 0; i < allExams.length; i++) {
      for (let j = i + 1; j < allExams.length; j++) {
        const exam1 = allExams[i];
        const exam2 = allExams[j];

        // Check if same date
        if (exam1.date.toDateString() === exam2.date.toDateString()) {
          const start1 = timeToMinutes(exam1.startTime);
          const end1 = start1 + exam1.duration;
          const start2 = timeToMinutes(exam2.startTime);
          const end2 = start2 + exam2.duration;

          // Check if times overlap
          const timesOverlap = !(end1 <= start2 || end2 <= start1);

          if (timesOverlap) {
            // Check for room conflict
            if (exam1.room && exam1.room === exam2.room) {
              conflicts.push({
                exam1Id: exam1._id.toString(),
                exam2Id: exam2._id.toString(),
                conflictType: 'room',
                severity: 'high',
                date: exam1.date,
                message: `Room conflict: "${exam1.title}" and "${exam2.title}" in ${exam1.room}`
              });
            } else {
              // Check for class overlap
              const overlappingClasses = exam1.classIds.filter(classId =>
                exam2.classIds.some(id => id.toString() === classId.toString())
              );

              if (overlappingClasses.length > 0) {
                conflicts.push({
                  exam1Id: exam1._id.toString(),
                  exam2Id: exam2._id.toString(),
                  conflictType: 'class',
                  severity: 'high',
                  date: exam1.date,
                  message: `Class conflict: "${exam1.title}" and "${exam2.title}"`
                });
              }
            }
          }
        }
      }
    }

    const formattedConflicts = conflicts;

    res.status(200).json({
      success: true,
      data: {
        overview,
        upcomingExams: formattedUpcoming,
        conflicts: formattedConflicts
      }
    });
  } catch (error) {
    console.error('Error fetching exam dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exam dashboard',
      error: { message: error.message }
    });
  }
};

// GET /api/admin/exams/conflicts - Check for conflicts
const getConflicts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const db = getDatabase();

    const query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const exams = await db.collection('exams')
      .find(query)
      .toArray();

    const conflicts = [];

    for (let i = 0; i < exams.length; i++) {
      for (let j = i + 1; j < exams.length; j++) {
        const exam1 = exams[i];
        const exam2 = exams[j];

        // Check if same date
        if (exam1.date.toDateString() === exam2.date.toDateString()) {
          const start1 = timeToMinutes(exam1.startTime);
          const end1 = start1 + exam1.duration;
          const start2 = timeToMinutes(exam2.startTime);
          const end2 = start2 + exam2.duration;

          // Check if times overlap
          const timesOverlap = !(end1 <= start2 || end2 <= start1);

          if (timesOverlap) {
            // Check for room conflict
            if (exam1.room && exam1.room === exam2.room) {
              conflicts.push({
                exam1: {
                  id: exam1._id.toString(),
                  title: exam1.title,
                  date: exam1.date,
                  startTime: exam1.startTime,
                  room: exam1.room
                },
                exam2: {
                  id: exam2._id.toString(),
                  title: exam2.title,
                  date: exam2.date,
                  startTime: exam2.startTime,
                  room: exam2.room
                },
                conflictType: 'room',
                severity: 'high'
              });
            } else {
              // Check for class overlap
              const overlappingClasses = exam1.classIds.filter(classId =>
                exam2.classIds.some(id => id.toString() === classId.toString())
              );

              if (overlappingClasses.length > 0) {
                conflicts.push({
                  exam1: {
                    id: exam1._id.toString(),
                    title: exam1.title,
                    date: exam1.date,
                    startTime: exam1.startTime
                  },
                  exam2: {
                    id: exam2._id.toString(),
                    title: exam2.title,
                    date: exam2.date,
                    startTime: exam2.startTime
                  },
                  conflictType: 'class',
                  severity: 'high'
                });
              }
            }
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: { conflicts }
    });
  } catch (error) {
    console.error('Error checking conflicts:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking conflicts',
      error: { message: error.message }
    });
  }
};

// GET /api/admin/exams/analytics - Get exam analytics
const getExamAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, classId, subject } = req.query;
    const db = getDatabase();

    const query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (classId) {
      query.classIds = new ObjectId(classId);
    }
    if (subject) {
      query.subject = subject;
    }

    const exams = await db.collection('exams').find(query).toArray();

    // Group by subject
    const examsBySubject = {};
    exams.forEach(exam => {
      if (!examsBySubject[exam.subject]) {
        examsBySubject[exam.subject] = { count: 0, upcoming: 0, completed: 0 };
      }
      examsBySubject[exam.subject].count++;
      if (exam.status === 'scheduled' || exam.status === 'published') {
        examsBySubject[exam.subject].upcoming++;
      } else if (exam.status === 'completed') {
        examsBySubject[exam.subject].completed++;
      }
    });

    // Group by class
    const examsByClass = {};
    exams.forEach(exam => {
      exam.classIds.forEach(classId => {
        const id = classId.toString();
        if (!examsByClass[id]) {
          examsByClass[id] = { count: 0, upcoming: 0, completed: 0 };
        }
        examsByClass[id].count++;
        if (exam.status === 'scheduled' || exam.status === 'published') {
          examsByClass[id].upcoming++;
        } else if (exam.status === 'completed') {
          examsByClass[id].completed++;
        }
      });
    });

    // Get class names
    const classIds = Object.keys(examsByClass);
    const classes = await db.collection('classes')
      .find({ _id: { $in: classIds.map(id => new ObjectId(id)) } })
      .toArray();

    const classMap = new Map(classes.map(c => [c._id.toString(), c.name]));

    // Group by month
    const monthlyDistribution = {};
    exams.forEach(exam => {
      const monthKey = `${exam.date.getFullYear()}-${String(exam.date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyDistribution[monthKey]) {
        monthlyDistribution[monthKey] = 0;
      }
      monthlyDistribution[monthKey]++;
    });

    // Room utilization
    const roomUtilization = {};
    exams.forEach(exam => {
      if (exam.room) {
        if (!roomUtilization[exam.room]) {
          roomUtilization[exam.room] = { usageCount: 0 };
        }
        roomUtilization[exam.room].usageCount++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        examsBySubject: Object.entries(examsBySubject).map(([subject, data]) => ({
          subject,
          ...data
        })),
        examsByClass: Object.entries(examsByClass).map(([classId, data]) => ({
          classId,
          className: classMap.get(classId) || 'N/A',
          ...data
        })),
        monthlyDistribution: Object.entries(monthlyDistribution).map(([month, count]) => ({
          month,
          count
        })),
        roomUtilization: Object.entries(roomUtilization).map(([room, data]) => ({
          room,
          ...data,
          utilizationRate: data.usageCount // Can be calculated as percentage
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching exam analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exam analytics',
      error: { message: error.message }
    });
  }
};

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  bulkCreateExams,
  getExamDashboard,
  getConflicts,
  getExamAnalytics
};
