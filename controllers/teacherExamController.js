const { getDatabase, ObjectId } = require('../db');

// GET /api/teacher/exams - Get exams for teacher's assigned classes
const getTeacherExams = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const {
      classId,
      subject,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    const db = getDatabase();

    // Get teacher's assigned classes
    const teacher = await db.collection('teachers').findOne({ _id: new ObjectId(teacherId) });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
        error: { message: 'No teacher found with this ID' }
      });
    }

    // Build query - exams where teacher is assigned or teaches the class
    const query = {
      $or: [
        { teacherIds: new ObjectId(teacherId) },
        { classIds: { $in: teacher.classes || [] } }
      ]
    };

    if (classId) {
      query.classIds = new ObjectId(classId);
    }

    if (subject) {
      query.subject = subject;
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

    // Fetch exams
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
    console.error('Error fetching teacher exams:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exams',
      error: { message: error.message }
    });
  }
};

// GET /api/teacher/exams/:id - Get detailed exam information
const getTeacherExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;
    const db = getDatabase();

    // Get teacher
    const teacher = await db.collection('teachers').findOne({ _id: new ObjectId(teacherId) });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Get exam
    const exam = await db.collection('exams').findOne({ _id: new ObjectId(id) });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
        error: { message: `No exam found with id: ${id}` }
      });
    }

    // Check if teacher has access
    const hasAccess = exam.teacherIds.some(tid => tid.toString() === teacherId) ||
                      exam.classIds.some(classId =>
                        (teacher.classes || []).some(c => c.toString() === classId.toString())
                      );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        error: { message: 'You do not have access to this exam' }
      });
    }

    // Get class information
    const classes = await db.collection('classes')
      .find({ _id: { $in: exam.classIds } })
      .toArray();

    const classMap = new Map(classes.map(c => [c._id.toString(), c.name]));

    // Get student count
    const students = await db.collection('students')
      .find({ classes: { $in: exam.classIds } })
      .toArray();

    // Get teacher information
    let teachers = [];
    if (exam.teacherIds && exam.teacherIds.length > 0) {
      const teacherDocs = await db.collection('teachers')
        .find({ _id: { $in: exam.teacherIds } })
        .toArray();

      teachers = teacherDocs.map(t => ({
        id: t._id.toString(),
        name: `${t.firstName} ${t.lastName}`,
        email: t.email
      }));
    }

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
      totalStudents: students.length,
      teachers,
      createdBy: exam.createdBy.toString(),
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt
    };

    res.status(200).json({
      success: true,
      data: responseExam
    });
  } catch (error) {
    console.error('Error fetching exam details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exam details',
      error: { message: error.message }
    });
  }
};

// GET /api/teacher/exams/:id/enrollment - Get enrolled students for an exam
const getExamEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;
    const db = getDatabase();

    // Get teacher
    const teacher = await db.collection('teachers').findOne({ _id: new ObjectId(teacherId) });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Get exam
    const exam = await db.collection('exams').findOne({ _id: new ObjectId(id) });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Check if teacher has access
    const hasAccess = exam.teacherIds.some(tid => tid.toString() === teacherId) ||
                      exam.classIds.some(classId =>
                        (teacher.classes || []).some(c => c.toString() === classId.toString())
                      );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get students from all exam classes
    const students = await db.collection('students')
      .find({ classes: { $in: exam.classIds } })
      .toArray();

    // Get class information
    const classes = await db.collection('classes')
      .find({ _id: { $in: exam.classIds } })
      .toArray();

    const classMap = new Map(classes.map(c => [c._id.toString(), c.name]));

    // Format enrolled students
    const enrolledStudents = students.map(student => {
      // Find which class this student belongs to (from exam's classes)
      const studentClassId = student.classes.find(c =>
        exam.classIds.some(examClassId => examClassId.toString() === c.toString())
      );

      return {
        studentId: student._id.toString(),
        studentName: `${student.firstName} ${student.lastName}`,
        studentIdNumber: student.studentId,
        className: classMap.get(studentClassId?.toString()) || 'N/A',
        email: student.email
      };
    });

    res.status(200).json({
      success: true,
      data: {
        examId: exam._id.toString(),
        examTitle: exam.title,
        totalStudents: students.length,
        enrolledStudents
      }
    });
  } catch (error) {
    console.error('Error fetching exam enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exam enrollment',
      error: { message: error.message }
    });
  }
};

// GET /api/teacher/exams/upcoming - Get upcoming exams for teacher
const getTeacherUpcomingExams = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { limit = 10 } = req.query;
    const db = getDatabase();

    // Get teacher
    const teacher = await db.collection('teachers').findOne({ _id: new ObjectId(teacherId) });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get upcoming exams
    const query = {
      $or: [
        { teacherIds: new ObjectId(teacherId) },
        { classIds: { $in: teacher.classes || [] } }
      ],
      date: { $gte: today }
    };

    const exams = await db.collection('exams')
      .find(query)
      .sort({ date: 1, startTime: 1 })
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
      classNames: exam.classIds.map(id => classMap.get(id.toString()) || 'N/A'),
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
      duration: exam.duration,
      room: exam.room,
      status: 'upcoming'
    }));

    res.status(200).json({
      success: true,
      data: {
        exams: formattedExams
      }
    });
  } catch (error) {
    console.error('Error fetching upcoming exams:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming exams',
      error: { message: error.message }
    });
  }
};

// GET /api/teacher/exams/calendar - Get exam calendar for teacher
const getTeacherExamCalendar = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'Year and month are required'
      });
    }

    const db = getDatabase();

    // Get teacher
    const teacher = await db.collection('teachers').findOne({ _id: new ObjectId(teacherId) });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Build date range for the month
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

    // Get exams for the month
    const query = {
      $or: [
        { teacherIds: new ObjectId(teacherId) },
        { classIds: { $in: teacher.classes || [] } }
      ],
      date: { $gte: startDate, $lte: endDate }
    };

    const exams = await db.collection('exams')
      .find(query)
      .sort({ date: 1, startTime: 1 })
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

    // Group exams by date
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(parseInt(year), parseInt(month) - 1, day);
      const dayExams = exams.filter(exam =>
        exam.date.getDate() === day &&
        exam.date.getMonth() === date.getMonth() &&
        exam.date.getFullYear() === date.getFullYear()
      );

      days.push({
        date: date.toISOString(),
        exams: dayExams.map(exam => ({
          id: exam._id.toString(),
          title: exam.title,
          subject: exam.subject,
          startTime: exam.startTime,
          endTime: exam.endTime,
          room: exam.room,
          classNames: exam.classIds.map(id => classMap.get(id.toString()) || 'N/A')
        }))
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
    console.error('Error fetching exam calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exam calendar',
      error: { message: error.message }
    });
  }
};

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

    const timesOverlap = !(endMinutes <= existingStart || startMinutes >= existingEnd);

    if (timesOverlap) {
      if (room && existingExam.room === room) {
        conflicts.push({
          type: 'room',
          severity: 'high',
          exam: existingExam,
          message: `Room conflict with exam "${existingExam.title}" in ${room}`
        });
      }

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

// POST /api/teacher/exams - Create exam for teacher's assigned class
const createTeacherExam = async (req, res) => {
  try {
    const teacherId = req.user.id;
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
      examType
    } = req.body;

    // Validation
    if (!title || !subject || !classIds || !date || !startTime || !duration || !totalMarks || !examType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        error: { message: 'title, subject, classIds, date, startTime, duration, totalMarks, and examType are required' }
      });
    }

    const db = getDatabase();

    // Get teacher's assigned classes
    const teacher = await db.collection('teachers').findOne({ _id: new ObjectId(teacherId) });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
        error: { message: 'No teacher found with this ID' }
      });
    }

    // Get teacher's assigned classes
    const assignedClassIds = teacher.classes || [];

    if (assignedClassIds.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'No classes assigned to teacher',
        error: { message: 'You must be assigned to at least one class to create exams' }
      });
    }

    // Validate that all requested classes are assigned to this teacher
    const validClassIds = classIds.filter(id =>
      assignedClassIds.some(assignedId => assignedId.toString() === id.toString())
    );

    if (validClassIds.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized for these classes',
        error: { message: 'You can only create exams for your assigned classes' }
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

    // Check for conflicts (only for valid class IDs)
    const conflicts = await checkConflicts(db, {
      date,
      startTime,
      duration,
      room,
      classIds: validClassIds.map(id => new ObjectId(id))
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
      classIds: validClassIds.map(id => new ObjectId(id)),
      date: examDate,
      startTime,
      endTime,
      duration: parseInt(duration),
      totalMarks: parseInt(totalMarks),
      room: room || null,
      instructions: instructions || '',
      examType,
      status: 'scheduled',
      createdBy: new ObjectId(teacherId),
      teacherIds: [new ObjectId(teacherId)],
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

// PUT /api/teacher/exams/:id - Update exam (only if teacher created it)
const updateTeacherExam = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;
    const updates = req.body;

    const db = getDatabase();

    // Check if exam exists and teacher is the creator
    const existingExam = await db.collection('exams').findOne({
      _id: new ObjectId(id),
      createdBy: new ObjectId(teacherId)
    });

    if (!existingExam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found or access denied',
        error: { message: 'You can only update exams you created' }
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
          message: 'Cannot schedule exam in the past'
        });
      }
    }

    // Validate duration and totalMarks if provided
    if (updates.duration !== undefined && updates.duration <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be positive'
      });
    }

    if (updates.totalMarks !== undefined && updates.totalMarks <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Total marks must be positive'
      });
    }

    // Validate time format if provided
    if (updates.startTime) {
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(updates.startTime)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid time format'
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

    // Convert classIds to ObjectId if provided
    if (updates.classIds) {
      // Validate classes are assigned to teacher
      const teacher = await db.collection('teachers').findOne({ _id: new ObjectId(teacherId) });
      const assignedClassIds = teacher.classes || [];

      const validClassIds = updates.classIds.filter(id =>
        assignedClassIds.some(assignedId => assignedId.toString() === id.toString())
      );

      if (validClassIds.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized for these classes'
        });
      }

      updateData.classIds = validClassIds.map(id => new ObjectId(id));
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

    res.status(200).json({
      success: true,
      data: { id, ...updates },
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

// DELETE /api/teacher/exams/:id - Delete exam (only if teacher created it)
const deleteTeacherExam = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;
    const db = getDatabase();

    // Check if exam exists and teacher is the creator
    const exam = await db.collection('exams').findOne({
      _id: new ObjectId(id),
      createdBy: new ObjectId(teacherId)
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found or access denied',
        error: { message: 'You can only delete exams you created' }
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
            cancelledBy: new ObjectId(teacherId),
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

module.exports = {
  getTeacherExams,
  getTeacherExamById,
  getExamEnrollment,
  getTeacherUpcomingExams,
  getTeacherExamCalendar,
  createTeacherExam,
  updateTeacherExam,
  deleteTeacherExam
};
