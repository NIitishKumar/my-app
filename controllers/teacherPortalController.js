const { getDatabase, ObjectId } = require('../db');

// Helper function to calculate attendance rate
const calculateAttendanceRate = async (db, classId) => {
  const records = await db.collection('attendance').find({
    classId: new ObjectId(classId)
  }).toArray();

  if (records.length === 0) return null;

  let totalDays = 0;
  let presentDays = 0;

  records.forEach(record => {
    if (record.students) {
      record.students.forEach(student => {
        totalDays++;
        if (student.status === 'present') {
          presentDays++;
        }
      });
    }
  });

  return totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
};

// Helper function to get last attendance date
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

// Get all assigned classes for a teacher
const getAssignedClasses = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const db = getDatabase();

    // Find all classes where this teacher is assigned
    const classes = await db.collection('classes')
      .find({
        isActive: true,
        'assignedTeachers.teacherId': new ObjectId(teacherId)
      })
      .toArray();

    // Process each class
    const enrichedClasses = await Promise.all(
      classes.map(async (classItem) => {
        const enrichedClass = { ...classItem };

        // Populate students
        if (classItem.students && classItem.students.length > 0) {
          const studentIds = classItem.students.map(id =>
            typeof id === 'string' ? new ObjectId(id) : id
          );
          const students = await db.collection('students')
            .find({ _id: { $in: studentIds } })
            .project({
              firstName: 1,
              lastName: 1,
              email: 1,
              studentId: 1,
              age: 1,
              gender: 1
            })
            .toArray();
          enrichedClass.students = students;
        }

        // Populate lectures
        if (classItem.lectures && classItem.lectures.length > 0) {
          const lectureIds = classItem.lectures.map(id =>
            typeof id === 'string' ? new ObjectId(id) : id
          );
          const lectures = await db.collection('lectures')
            .find({ _id: { $in: lectureIds } })
            .project({
              title: 1,
              subject: 1,
              schedule: 1,
              duration: 1,
              type: 1
            })
            .toArray();
          enrichedClass.lectures = lectures;
        }

        // Calculate attendance rate
        const attendanceRate = await calculateAttendanceRate(db, classItem._id);
        enrichedClass.attendanceRate = attendanceRate;

        // Get last attendance date
        const lastAttendanceDate = await getLastAttendanceDate(db, classItem._id);
        enrichedClass.lastAttendanceDate = lastAttendanceDate;

        // Get primary subject for this teacher from assignedTeachers
        const teacherAssignment = classItem.assignedTeachers.find(
          at => at.teacherId.toString() === teacherId
        );
        enrichedClass.subject = teacherAssignment ? teacherAssignment.subject : null;

        return enrichedClass;
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedClasses.length,
      data: enrichedClasses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching assigned classes',
      error: error.message
    });
  }
};

// Get specific class details (with authorization check in middleware)
const getClassDetails = async (req, res) => {
  try {
    const classId = req.params.classId;
    const teacherId = req.user.id;
    const db = getDatabase();

    if (!ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class ID'
      });
    }

    const classData = await db.collection('classes').findOne({
      _id: new ObjectId(classId),
      isActive: true
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    const enrichedClass = { ...classData };

    // Populate students
    if (classData.students && classData.students.length > 0) {
      const studentIds = classData.students.map(id =>
        typeof id === 'string' ? new ObjectId(id) : id
      );
      const students = await db.collection('students')
        .find({ _id: { $in: studentIds } })
        .project({
          firstName: 1,
          lastName: 1,
          email: 1,
          studentId: 1,
          age: 1,
          gender: 1
        })
        .toArray();
      enrichedClass.students = students;
    }

    // Populate lectures
    if (classData.lectures && classData.lectures.length > 0) {
      const lectureIds = classData.lectures.map(id =>
        typeof id === 'string' ? new ObjectId(id) : id
      );
      const lectures = await db.collection('lectures')
        .find({ _id: { $in: lectureIds } })
        .project({
          title: 1,
          subject: 1,
          teacher: 1,
          schedule: 1,
          duration: 1,
          type: 1
        })
        .toArray();
      enrichedClass.lectures = lectures;
    }

    // Calculate attendance rate
    const attendanceRate = await calculateAttendanceRate(db, classData._id);
    enrichedClass.attendanceRate = attendanceRate;

    // Get last attendance date
    const lastAttendanceDate = await getLastAttendanceDate(db, classData._id);
    enrichedClass.lastAttendanceDate = lastAttendanceDate;

    // Get primary subject for this teacher
    const teacherAssignment = classData.assignedTeachers.find(
      at => at.teacherId.toString() === teacherId
    );
    enrichedClass.subject = teacherAssignment ? teacherAssignment.subject : null;

    res.status(200).json({
      success: true,
      data: enrichedClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching class details',
      error: error.message
    });
  }
};

// Get teacher profile
const getTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const db = getDatabase();

    const teacher = await db.collection('teachers').findOne({
      _id: new ObjectId(teacherId),
      isActive: true
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Get assigned classes count
    const assignedClassesCount = await db.collection('classes').countDocuments({
      isActive: true,
      'assignedTeachers.teacherId': new ObjectId(teacherId)
    });

    res.status(200).json({
      success: true,
      data: {
        ...teacher,
        assignedClassesCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher profile',
      error: error.message
    });
  }
};

// Get teacher dashboard - comprehensive data for teacher dashboard
const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const db = getDatabase();

    // Get teacher profile
    const teacher = await db.collection('teachers').findOne({
      _id: new ObjectId(teacherId),
      isActive: true
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Get assigned classes
    const classes = await db.collection('classes')
      .find({
        isActive: true,
        'assignedTeachers.teacherId': new ObjectId(teacherId)
      })
      .toArray();

    // Calculate stats
    const totalStudents = classes.reduce((sum, cls) => sum + (cls.students?.length || 0), 0);
    const totalClasses = classes.length;

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's lectures
    const todayLectures = await db.collection('lectures')
      .find({
        'schedule.date': {
          $gte: today,
          $lt: tomorrow
        },
        'teacherId': new ObjectId(teacherId)
      })
      .toArray();

    // Get recent attendance (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentAttendance = await db.collection('attendance')
      .find({
        classId: { $in: classes.map(c => c._id) },
        date: { $gte: sevenDaysAgo }
      })
      .sort({ date: -1 })
      .limit(10)
      .toArray();

    // Calculate attendance statistics
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;

    recentAttendance.forEach(record => {
      if (record.students) {
        record.students.forEach(student => {
          if (student.status === 'present') totalPresent++;
          else if (student.status === 'absent') totalAbsent++;
          else if (student.status === 'late') totalLate++;
        });
      }
    });

    // Enrich classes with basic info
    const enrichedClasses = await Promise.all(
      classes.map(async (classItem) => {
        const attendanceRate = await calculateAttendanceRate(db, classItem._id);
        const lastAttendanceDate = await getLastAttendanceDate(db, classItem._id);

        const teacherAssignment = classItem.assignedTeachers.find(
          at => at.teacherId.toString() === teacherId
        );

        return {
          _id: classItem._id,
          className: classItem.className,
          section: classItem.section,
          subject: teacherAssignment ? teacherAssignment.subject : null,
          studentCount: classItem.students?.length || 0,
          attendanceRate: attendanceRate,
          lastAttendanceDate: lastAttendanceDate
        };
      })
    );

    // Get upcoming lectures (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingLectures = await db.collection('lectures')
      .find({
        'schedule.date': {
          $gte: today,
          $lt: nextWeek
        },
        'teacherId': new ObjectId(teacherId)
      })
      .sort({ 'schedule.date': 1 })
      .limit(5)
      .toArray();

    res.status(200).json({
      success: true,
      data: {
        teacher: {
          _id: teacher._id,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
          employeeId: teacher.employeeId
        },
        stats: {
          totalClasses,
          totalStudents,
          todayLectures: todayLectures.length,
          upcomingLectures: upcomingLectures.length,
          recentAttendanceRecords: recentAttendance.length
        },
        classes: enrichedClasses,
        todaySchedule: todayLectures,
        upcomingLectures,
        recentAttendance,
        attendanceSummary: {
          present: totalPresent,
          absent: totalAbsent,
          late: totalLate
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher dashboard',
      error: error.message
    });
  }
};

module.exports = {
  getAssignedClasses,
  getClassDetails,
  getTeacherProfile,
  getTeacherDashboard,
  calculateAttendanceRate,
  getLastAttendanceDate
};
