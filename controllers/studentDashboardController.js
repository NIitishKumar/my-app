const { getDatabase, ObjectId } = require('../db');

// Helper function to calculate GPA from percentage
const calculateGPA = (percentage) => {
  if (percentage >= 97) return 4.0;
  if (percentage >= 93) return 4.0;
  if (percentage >= 90) return 3.7;
  if (percentage >= 87) return 3.3;
  if (percentage >= 83) return 3.0;
  if (percentage >= 80) return 2.7;
  if (percentage >= 77) return 2.3;
  if (percentage >= 73) return 2.0;
  if (percentage >= 70) return 1.7;
  if (percentage >= 67) return 1.3;
  if (percentage >= 65) return 1.0;
  return 0.0;
};

// Helper function to calculate letter grade
const getLetterGrade = (percentage) => {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 65) return 'D';
  return 'F';
};

// 1. Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    const db = getDatabase();

    // Get student's class
    const student = await db.collection('students').findOne({
      _id: new ObjectId(studentId)
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get attendance percentage
    const attendanceRecords = await db.collection('attendance').find({
      classId: { $in: student.classes || [] }
    }).toArray();

    let totalDays = 0;
    let presentDays = 0;

    attendanceRecords.forEach(record => {
      if (record.students) {
        const studentRecord = record.students.find(
          s => s.studentId.toString() === studentId
        );
        if (studentRecord) {
          totalDays++;
          if (studentRecord.status === 'present') presentDays++;
        }
      }
    });

    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    // Get upcoming exams count
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingExamsCount = await db.collection('exams').countDocuments({
      date: { $gte: today },
      status: 'upcoming'
    });

    // Get unread notifications count
    const unreadNotificationsCount = await db.collection('notifications').countDocuments({
      targetType: 'student',
      targetId: studentId,
      is_read: false
    });

    // Calculate overall GPA from grades
    const grades = await db.collection('grades').find({
      studentId: new ObjectId(studentId)
    }).toArray();

    let overallGPA = 0;
    if (grades.length > 0) {
      const totalPercentage = grades.reduce((sum, grade) => sum + (grade.percentage || 0), 0);
      const avgPercentage = totalPercentage / grades.length;
      overallGPA = calculateGPA(avgPercentage);
    }

    // Calculate attendance trend (compare this month with last month)
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const lastMonth = new Date(thisMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const thisMonthAttendance = attendanceRecords.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate >= thisMonth;
    });

    const lastMonthAttendance = attendanceRecords.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate >= lastMonth && recordDate < thisMonth;
    });

    let thisMonthPresent = 0;
    let thisMonthTotal = 0;
    thisMonthAttendance.forEach(record => {
      const studentRecord = record.students?.find(s => s.studentId.toString() === studentId);
      if (studentRecord) {
        thisMonthTotal++;
        if (studentRecord.status === 'present') thisMonthPresent++;
      }
    });

    let lastMonthPresent = 0;
    let lastMonthTotal = 0;
    lastMonthAttendance.forEach(record => {
      const studentRecord = record.students?.find(s => s.studentId.toString() === studentId);
      if (studentRecord) {
        lastMonthTotal++;
        if (studentRecord.status === 'present') lastMonthPresent++;
      }
    });

    const thisMonthPct = thisMonthTotal > 0 ? (thisMonthPresent / thisMonthTotal) * 100 : 0;
    const lastMonthPct = lastMonthTotal > 0 ? (lastMonthPresent / lastMonthTotal) * 100 : 0;

    let attendanceTrend = 'stable';
    if (thisMonthPct > lastMonthPct + 5) attendanceTrend = 'up';
    else if (thisMonthPct < lastMonthPct - 5) attendanceTrend = 'down';

    res.status(200).json({
      success: true,
      data: {
        attendancePercentage: Math.round(attendancePercentage * 10) / 10,
        upcomingExamsCount,
        unreadNotificationsCount,
        overallGPA: Math.round(overallGPA * 10) / 10,
        attendanceTrend
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

// 2. Upcoming Exams
const getUpcomingExams = async (req, res) => {
  try {
    const studentId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;
    const db = getDatabase();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exams = await db.collection('exams').find({
      date: { $gte: today },
      status: 'upcoming'
    }).sort({ date: 1 }).limit(limit).toArray();

    res.status(200).json({
      success: true,
      data: exams.map(exam => ({
        id: exam._id.toString(),
        title: exam.title,
        subject: exam.subject,
        date: exam.date.toISOString(),
        duration: exam.duration || 0,
        total_marks: exam.totalMarks || 100,
        obtained_marks: exam.obtainedMarks || null,
        status: exam.status,
        room: exam.room || null
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming exams',
      error: error.message
    });
  }
};

// 3. Recent Notifications
const getRecentNotifications = async (req, res) => {
  try {
    const studentId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;
    const db = getDatabase();

    const notifications = await db.collection('notifications').find({
      $or: [
        { targetType: 'all' },
        { targetType: 'student', targetId: studentId }
      ]
    }).sort({ createdAt: -1 }).limit(limit).toArray();

    res.status(200).json({
      success: true,
      data: notifications.map(notif => ({
        id: notif._id.toString(),
        title: notif.title,
        message: notif.message,
        type: notif.type || 'info',
        is_read: notif.is_read || false,
        created_at: notif.createdAt?.toISOString() || notif.created_at?.toISOString()
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// 4. Attendance Statistics
const getAttendanceStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    const db = getDatabase();

    const student = await db.collection('students').findOne({
      _id: new ObjectId(studentId)
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get all attendance records
    const attendanceRecords = await db.collection('attendance').find({
      classId: { $in: student.classes || [] }
    }).toArray();

    // Calculate overall percentage
    let totalDays = 0;
    let presentDays = 0;

    attendanceRecords.forEach(record => {
      const studentRecord = record.students?.find(
        s => s.studentId.toString() === studentId
      );
      if (studentRecord) {
        totalDays++;
        if (studentRecord.status === 'present') presentDays++;
      }
    });

    const overallPercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    // Calculate monthly data for last 6 months
    const monthlyData = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const nextMonthDate = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);

      const monthRecords = attendanceRecords.filter(r => {
        const recordDate = new Date(r.date);
        return recordDate >= monthDate && recordDate < nextMonthDate;
      });

      let monthTotal = 0;
      let monthPresent = 0;

      monthRecords.forEach(record => {
        const studentRecord = record.students?.find(
          s => s.studentId.toString() === studentId
        );
        if (studentRecord) {
          monthTotal++;
          if (studentRecord.status === 'present') monthPresent++;
        }
      });

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      monthlyData.push({
        month: monthNames[monthDate.getMonth()],
        percentage: monthTotal > 0 ? Math.round((monthPresent / monthTotal) * 100) : 0,
        totalDays: monthTotal,
        presentDays: monthPresent
      });
    }

    // Get recent records (last 5)
    const recentRecords = attendanceRecords
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(record => {
        const studentRecord = record.students?.find(
          s => s.studentId.toString() === studentId
        );
        return {
          date: record.date.toISOString(),
          status: studentRecord?.status || 'absent',
          subject: record.subject || 'N/A'
        };
      });

    // Calculate trend
    const currentMonthPct = monthlyData[monthlyData.length - 1].percentage;
    const lastMonthPct = monthlyData[monthlyData.length - 2].percentage;

    let trend = 'stable';
    if (currentMonthPct > lastMonthPct + 5) trend = 'up';
    else if (currentMonthPct < lastMonthPct - 5) trend = 'down';

    res.status(200).json({
      success: true,
      data: {
        overallPercentage: Math.round(overallPercentage * 10) / 10,
        monthlyData,
        recentRecords,
        trend
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance statistics',
      error: error.message
    });
  }
};

// 5. Academic Summary
const getAcademicSummary = async (req, res) => {
  try {
    const studentId = req.user.id;
    const db = getDatabase();

    // Get all grades
    const grades = await db.collection('grades').find({
      studentId: new ObjectId(studentId)
    }).toArray();

    // Calculate overall GPA and percentage
    let overallGPA = 0;
    let overallPercentage = 0;

    if (grades.length > 0) {
      const totalPercentage = grades.reduce((sum, grade) => sum + (grade.percentage || 0), 0);
      overallPercentage = totalPercentage / grades.length;
      overallGPA = calculateGPA(overallPercentage);
    }

    // Group by subject for subject summary
    const subjectMap = new Map();

    grades.forEach(grade => {
      const subject = grade.subject || 'Unknown';
      if (!subjectMap.has(subject)) {
        subjectMap.set(subject, []);
      }
      subjectMap.get(subject).push(grade);
    });

    const subjectSummary = Array.from(subjectMap.entries()).map(([subject, subjectGrades]) => {
      const totalMarks = subjectGrades.reduce((sum, g) => sum + (g.obtainedMarks || 0), 0);
      const maxMarks = subjectGrades.reduce((sum, g) => sum + (g.totalMarks || 100), 0);
      const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;

      return {
        subject,
        grade: getLetterGrade(percentage),
        percentage: Math.round(percentage * 10) / 10,
        totalMarks: maxMarks,
        obtainedMarks: Math.round(totalMarks * 10) / 10
      };
    });

    // Get recent grades (last 5)
    const recentGrades = grades
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 5)
      .map(grade => ({
        subject: grade.subject || 'N/A',
        grade: getLetterGrade(grade.percentage || 0),
        percentage: Math.round((grade.percentage || 0) * 10) / 10,
        term: grade.term || 'N/A',
        date: grade.createdAt?.toISOString() || grade.date?.toISOString() || new Date().toISOString()
      }));

    res.status(200).json({
      success: true,
      data: {
        overallGPA: Math.round(overallGPA * 10) / 10,
        overallPercentage: Math.round(overallPercentage * 10) / 10,
        subjectSummary,
        recentGrades
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching academic summary',
      error: error.message
    });
  }
};

// 6. Today's Schedule
const getTodaySchedule = async (req, res) => {
  try {
    const studentId = req.user.id;
    const db = getDatabase();

    // Get student's classes
    const student = await db.collection('students').findOne({
      _id: new ObjectId(studentId)
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get today's date
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    // Get timetable for today
    const schedule = await db.collection('timetables').find({
      classId: { $in: student.classes || [] },
      day: dayOfWeek
    }).sort({ startTime: 1 }).toArray();

    const data = schedule.map(slot => ({
      id: slot._id.toString(),
      subject: slot.subject,
      teacher: slot.teacher || 'N/A',
      startTime: slot.startTime,
      endTime: slot.endTime,
      room: slot.room || null
    }));

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching today\'s schedule',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getUpcomingExams,
  getRecentNotifications,
  getAttendanceStats,
  getAcademicSummary,
  getTodaySchedule
};
