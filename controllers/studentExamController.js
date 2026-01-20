const { getDatabase, ObjectId } = require('../db');

// GET /api/student/exams - Get student's exam schedule
const getStudentExams = async (req, res) => {
  try {
    const studentId = req.user.id;
    const {
      status,
      subject,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    const db = getDatabase();

    // Get student's classes
    const student = await db.collection('students').findOne({ _id: new ObjectId(studentId) });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
        error: { message: 'No student found with this ID' }
      });
    }

    // Build query
    const query = {
      classIds: { $in: student.classes },
      isPublished: true
    };

    // Filter by status
    if (status === 'upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.date = { $gte: today };
    } else if (status === 'completed') {
      query.status = 'completed';
    } else if (status === 'cancelled') {
      query.status = 'cancelled';
    } else if (status === 'scheduled') {
      query.status = { $in: ['scheduled', 'published'] };
    }

    if (subject) {
      query.subject = subject;
    }

    if (startDate || endDate) {
      if (!query.date) query.date = {};
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
    const classes = await db.collection('classes')
      .find({ _id: { $in: student.classes } })
      .toArray();

    const classMap = new Map(classes.map(c => [c._id.toString(), c.name]));

    // Format exams
    const formattedExams = exams.map(exam => {
      const examStatus = exam.date > new Date() ? 'upcoming' :
                         exam.status === 'completed' ? 'completed' :
                         exam.status === 'cancelled' ? 'cancelled' : 'scheduled';

      return {
        id: exam._id.toString(),
        title: exam.title,
        subject: exam.subject,
        subjectCode: exam.subjectCode,
        classId: student.classes.find(c => exam.classIds.some(id => id.toString() === c.toString()))?.toString(),
        className: classMap.get(
          student.classes.find(c => exam.classIds.some(id => id.toString() === c.toString()))?.toString()
        ) || 'N/A',
        date: exam.date,
        startTime: exam.startTime,
        endTime: exam.endTime,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        room: exam.room,
        status: examStatus,
        instructions: exam.instructions,
        createdAt: exam.createdAt
      };
    });

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
    console.error('Error fetching student exams:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exams',
      error: { message: error.message }
    });
  }
};

// GET /api/student/exams/:id - Get detailed exam information
const getStudentExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;
    const db = getDatabase();

    // Get student's classes
    const student = await db.collection('students').findOne({ _id: new ObjectId(studentId) });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
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

    // Check if exam is for student's class and is published
    const hasAccess = exam.classIds.some(classId =>
      student.classes.some(studentClassId => studentClassId.toString() === classId.toString())
    );

    if (!hasAccess || !exam.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        error: { message: 'You do not have access to this exam' }
      });
    }

    // Get class information
    const classId = student.classes.find(c =>
      exam.classIds.some(id => id.toString() === c.toString())
    );

    const classObj = await db.collection('classes').findOne({ _id: classId });

    // Get teacher information
    let teacher = null;
    if (exam.teacherIds && exam.teacherIds.length > 0) {
      const teacherObj = await db.collection('teachers').findOne({ _id: exam.teacherIds[0] });
      if (teacherObj) {
        teacher = {
          id: teacherObj._id.toString(),
          name: `${teacherObj.firstName} ${teacherObj.lastName}`,
          email: teacherObj.email
        };
      }
    }

    // Get exam result if completed and published
    let results = null;
    if (exam.status === 'completed') {
      const result = await db.collection('examResults').findOne({
        examId: new ObjectId(id),
        studentId: new ObjectId(studentId)
      });

      if (result) {
        results = {
          obtainedMarks: result.obtainedMarks,
          grade: result.grade,
          percentage: result.percentage,
          publishedAt: result.publishedAt
        };
      }
    }

    // Format response
    const examStatus = exam.date > new Date() ? 'upcoming' :
                       exam.status === 'completed' ? 'completed' :
                       exam.status === 'cancelled' ? 'cancelled' : 'scheduled';

    const responseExam = {
      id: exam._id.toString(),
      title: exam.title,
      subject: exam.subject,
      subjectCode: exam.subjectCode,
      classId: classId.toString(),
      className: classObj?.name || 'N/A',
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      room: exam.room,
      status: examStatus,
      instructions: exam.instructions,
      examType: exam.examType,
      teacher,
      results,
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

// GET /api/student/exams/upcoming - Get upcoming exams
const getUpcomingExams = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { limit = 10 } = req.query;
    const db = getDatabase();

    // Get student's classes
    const student = await db.collection('students').findOne({ _id: new ObjectId(studentId) });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + 30);

    // Get upcoming exams
    const exams = await db.collection('exams')
      .find({
        classIds: { $in: student.classes },
        date: { $gte: today, $lte: futureDate },
        isPublished: true
      })
      .sort({ date: 1, startTime: 1 })
      .limit(parseInt(limit))
      .toArray();

    // Get class information
    const classes = await db.collection('classes')
      .find({ _id: { $in: student.classes } })
      .toArray();

    const classMap = new Map(classes.map(c => [c._id.toString(), c.name]));

    // Format exams
    const formattedExams = exams.map(exam => ({
      id: exam._id.toString(),
      title: exam.title,
      subject: exam.subject,
      subjectCode: exam.subjectCode,
      classId: student.classes.find(c => exam.classIds.some(id => id.toString() === c.toString()))?.toString(),
      className: classMap.get(
        student.classes.find(c => exam.classIds.some(id => id.toString() === c.toString()))?.toString()
      ) || 'N/A',
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      room: exam.room,
      status: 'upcoming',
      instructions: exam.instructions
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

// GET /api/student/exams/results - Get exam results
const getStudentExamResults = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { subject, page = 1, limit = 50 } = req.query;
    const db = getDatabase();

    // Build query for results
    const query = {
      studentId: new ObjectId(studentId),
      publishedAt: { $ne: null }
    };

    // Get total count
    const totalResults = await db.collection('examResults').countDocuments(query);

    // Fetch results with pagination
    const results = await db.collection('examResults')
      .find(query)
      .sort({ publishedAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .toArray();

    // Get exam details for each result
    const examIds = results.map(r => r.examId);
    const exams = await db.collection('exams')
      .find({ _id: { $in: examIds } })
      .toArray();

    const examMap = new Map(exams.map(e => [e._id.toString(), e]));

    // Filter by subject if specified
    let formattedResults = results.map(result => {
      const exam = examMap.get(result.examId.toString());
      return {
        examId: result.examId.toString(),
        examTitle: exam?.title || 'N/A',
        subject: exam?.subject || 'N/A',
        date: exam?.date || null,
        totalMarks: exam?.totalMarks || 0,
        obtainedMarks: result.obtainedMarks,
        grade: result.grade,
        percentage: result.percentage,
        publishedAt: result.publishedAt
      };
    });

    if (subject) {
      formattedResults = formattedResults.filter(r => r.subject === subject);
    }

    res.status(200).json({
      success: true,
      data: {
        results: formattedResults,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalResults / parseInt(limit)),
          totalRecords: totalResults
        }
      }
    });
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exam results',
      error: { message: error.message }
    });
  }
};

// GET /api/student/exams/calendar - Get exam calendar
const getStudentExamCalendar = async (req, res) => {
  try {
    const { year, month, studentId: queryStudentId } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'Year and month are required'
      });
    }

    const db = getDatabase();

    let studentClasses = [];

    // If user is a student, get their classes
    if (req.user.role === 'STUDENT') {
      const student = await db.collection('students').findOne({ _id: new ObjectId(req.user.id) });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      studentClasses = student.classes || [];
    }
    // If user is admin/teacher and a specific studentId is provided, get that student's classes
    else if (queryStudentId) {
      const student = await db.collection('students').findOne({ _id: new ObjectId(queryStudentId) });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      studentClasses = student.classes || [];
    }
    // If admin/teacher without studentId, show all published exams (no class filter)
    else {
      studentClasses = null; // No class filter for admins viewing all
    }

    // Build date range for the month
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

    // Build query
    const query = {
      date: { $gte: startDate, $lte: endDate },
      isPublished: true
    };

    // Only add class filter if we have specific classes
    if (studentClasses && studentClasses.length > 0) {
      query.classIds = { $in: studentClasses };
    }

    // Get exams for the month
    const exams = await db.collection('exams')
      .find(query)
      .sort({ date: 1, startTime: 1 })
      .toArray();

    // Get class information for all classes involved in exams
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
        exams: dayExams.map(exam => {
          // Get first matching class name
          const classNames = exam.classIds
            .map(id => classMap.get(id.toString()) || 'N/A')
            .join(', ');

          return {
            id: exam._id.toString(),
            title: exam.title,
            subject: exam.subject,
            startTime: exam.startTime,
            endTime: exam.endTime,
            room: exam.room,
            className: classNames
          };
        })
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

// GET /api/student/exams/export - Export exam schedule
const exportStudentExams = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { startDate, endDate, format } = req.query;

    if (!startDate || !endDate || !format) {
      return res.status(400).json({
        success: false,
        message: 'Start date, end date, and format are required'
      });
    }

    const db = getDatabase();

    // Get student's classes
    const student = await db.collection('students').findOne({ _id: new ObjectId(studentId) });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get exams
    const exams = await db.collection('exams')
      .find({
        classIds: { $in: student.classes },
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        },
        isPublished: true
      })
      .sort({ date: 1, startTime: 1 })
      .toArray();

    // Get class information
    const classes = await db.collection('classes')
      .find({ _id: { $in: student.classes } })
      .toArray();

    const classMap = new Map(classes.map(c => [c._id.toString(), c.name]));

    // Format data for export
    const exportData = exams.map(exam => {
      const examStatus = exam.date > new Date() ? 'upcoming' :
                         exam.status === 'completed' ? 'completed' :
                         exam.status === 'cancelled' ? 'cancelled' : 'scheduled';

      return {
        Title: exam.title,
        Subject: exam.subject,
        SubjectCode: exam.subjectCode || '',
        Date: exam.date.toISOString().split('T')[0],
        StartTime: exam.startTime,
        EndTime: exam.endTime,
        Duration: exam.duration,
        TotalMarks: exam.totalMarks,
        Room: exam.room || '',
        Status: examStatus,
        Instructions: exam.instructions || ''
      };
    });

    // Export based on format
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=exam_schedule_${startDate}_${endDate}.csv`);

      if (exportData.length === 0) {
        return res.send('No exams found in the specified date range');
      }

      const csv = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row =>
          Object.values(row).map(v =>
            typeof v === 'string' && v.includes(',') ? `"${v}"` : v
          ).join(',')
        )
      ].join('\n');

      return res.send(csv);
    }

    // For other formats, return JSON
    res.status(200).json({
      success: true,
      data: {
        student: {
          name: `${student.firstName} ${student.lastName}`,
          studentId: student.studentId
        },
        exams: exportData
      }
    });
  } catch (error) {
    console.error('Error exporting exams:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting exam schedule',
      error: { message: error.message }
    });
  }
};

module.exports = {
  getStudentExams,
  getStudentExamById,
  getUpcomingExams,
  getStudentExamResults,
  getStudentExamCalendar,
  exportStudentExams
};
