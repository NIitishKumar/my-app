const { getDatabase, ObjectId } = require('../db');

// Helper function to get Monday of the week for a given date
const getMondayOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

// Helper function to get Sunday of the week for a given date
const getSundayOfWeek = (date) => {
  const monday = getMondayOfWeek(date);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return sunday;
};

// Helper function to get day name
const getDayName = (dayOfWeek) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
};

// Helper function to format timetable slot
const formatTimetableSlot = (slot, teacherMap) => {
  const teacher = teacherMap.get(slot.teacherId?.toString()) || {};

  return {
    id: slot._id.toString(),
    subject: slot.subject || 'N/A',
    subjectCode: slot.subjectCode || null,
    teacher: {
      id: slot.teacherId?.toString() || null,
      name: teacher.name || `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || 'N/A',
      email: teacher.email || null
    },
    startTime: slot.startTime || '09:00',
    endTime: slot.endTime || '10:00',
    dayOfWeek: slot.dayOfWeek !== undefined ? slot.dayOfWeek : 1,
    room: slot.room || null,
    classId: slot.classId?.toString() || null,
    lectureId: slot.lectureId?.toString() || null,
    type: slot.type || 'lecture'
  };
};

// 1. Get Weekly Timetable
const getWeeklyTimetable = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { weekStart } = req.query;
    const db = getDatabase();

    // Get student's enrolled classes
    const student = await db.collection('students').findOne({
      _id: new ObjectId(studentId)
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found',
          code: 'STUDENT_NOT_FOUND'
        }
      });
    }

    // Determine week start date
    const today = new Date();
    const baseDate = weekStart ? new Date(weekStart) : today;

    if (isNaN(baseDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid date format. Use YYYY-MM-DD',
          code: 'INVALID_DATE_FORMAT'
        }
      });
    }

    const weekStartDate = getMondayOfWeek(baseDate);
    const weekEndDate = getSundayOfWeek(baseDate);

    // Get timetable slots for student's classes
    const classIds = student.classes || [];
    const timetableSlots = await db.collection('timetables').find({
      classId: { $in: classIds.map(id => (typeof id === 'string' ? new ObjectId(id) : id)) }
    }).toArray();

    // Get teacher information for all slots
    const teacherIds = timetableSlots
      .map(slot => slot.teacherId)
      .filter(id => id != null);

    const teachers = await db.collection('teachers').find({
      _id: { $in: teacherIds }
    }).toArray();

    const teacherMap = new Map();
    teachers.forEach(teacher => {
      teacherMap.set(teacher._id.toString(), teacher);
    });

    // Build days array (Monday to Sunday)
    const days = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (let i = 0; i < 7; i++) {
      const dayOfWeek = i + 1; // 1=Monday, 7=Sunday
      const currentDate = new Date(weekStartDate);
      currentDate.setDate(weekStartDate.getDate() + i);

      // Get slots for this day
      const daySlots = timetableSlots.filter(slot => slot.dayOfWeek === dayOfWeek);

      // Sort slots by start time
      daySlots.sort((a, b) => {
        const timeA = a.startTime || '00:00';
        const timeB = b.startTime || '00:00';
        return timeA.localeCompare(timeB);
      });

      days.push({
        day: dayOfWeek === 7 ? 0 : dayOfWeek, // Convert Sunday(7) to 0
        dayName: dayNames[i],
        date: currentDate.toISOString(),
        slots: daySlots.map(slot => formatTimetableSlot(slot, teacherMap))
      });
    }

    res.status(200).json({
      success: true,
      data: {
        weekStartDate: weekStartDate.toISOString(),
        weekEndDate: weekEndDate.toISOString(),
        days
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Error fetching weekly timetable',
        code: 'TIMETABLE_FETCH_ERROR',
        details: error.message
      }
    });
  }
};

// 2. Get Day Timetable
const getDayTimetable = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { date } = req.query;
    const db = getDatabase();

    // Validate date parameter
    if (!date) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Date parameter is required (YYYY-MM-DD)',
          code: 'MISSING_DATE_PARAMETER'
        }
      });
    }

    const requestedDate = new Date(date);

    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid date format. Use YYYY-MM-DD',
          code: 'INVALID_DATE_FORMAT'
        }
      });
    }

    // Get student's enrolled classes
    const student = await db.collection('students').findOne({
      _id: new ObjectId(studentId)
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found',
          code: 'STUDENT_NOT_FOUND'
        }
      });
    }

    // Calculate week start and end for context
    const weekStartDate = getMondayOfWeek(requestedDate);
    const weekEndDate = getSundayOfWeek(requestedDate);

    // Get day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
    const dayOfWeek = requestedDate.getDay();
    const queryDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // Convert Sunday(0) to 7 for query

    // Get timetable slots for student's classes and this day
    const classIds = student.classes || [];
    const timetableSlots = await db.collection('timetables').find({
      classId: { $in: classIds.map(id => (typeof id === 'string' ? new ObjectId(id) : id)) },
      dayOfWeek: queryDayOfWeek
    }).toArray();

    // Get teacher information
    const teacherIds = timetableSlots
      .map(slot => slot.teacherId)
      .filter(id => id != null);

    const teachers = await db.collection('teachers').find({
      _id: { $in: teacherIds }
    }).toArray();

    const teacherMap = new Map();
    teachers.forEach(teacher => {
      teacherMap.set(teacher._id.toString(), teacher);
    });

    // Sort slots by start time
    timetableSlots.sort((a, b) => {
      const timeA = a.startTime || '00:00';
      const timeB = b.startTime || '00:00';
      return timeA.localeCompare(timeB);
    });

    // Build day data
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const days = [{
      day: dayOfWeek,
      dayName: dayNames[dayOfWeek],
      date: requestedDate.toISOString(),
      slots: timetableSlots.map(slot => formatTimetableSlot(slot, teacherMap))
    }];

    res.status(200).json({
      success: true,
      data: {
        weekStartDate: weekStartDate.toISOString(),
        weekEndDate: weekEndDate.toISOString(),
        days
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Error fetching day timetable',
        code: 'TIMETABLE_FETCH_ERROR',
        details: error.message
      }
    });
  }
};

// 3. Get Timetable by Date Range
const getTimetableByDateRange = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { startDate, endDate } = req.query;
    const db = getDatabase();

    // Validate date parameters
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Both startDate and endDate are required (YYYY-MM-DD)',
          code: 'MISSING_DATE_PARAMETERS'
        }
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid date format. Use YYYY-MM-DD',
          code: 'INVALID_DATE_FORMAT'
        }
      });
    }

    if (start > end) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'startDate must be before or equal to endDate',
          code: 'INVALID_DATE_RANGE'
        }
      });
    }

    // Get student's enrolled classes
    const student = await db.collection('students').findOne({
      _id: new ObjectId(studentId)
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found',
          code: 'STUDENT_NOT_FOUND'
        }
      });
    }

    // Calculate week boundaries for context
    const weekStartDate = getMondayOfWeek(start);
    const weekEndDate = getSundayOfWeek(end);

    // Get all timetable slots for student's classes
    const classIds = student.classes || [];
    const timetableSlots = await db.collection('timetables').find({
      classId: { $in: classIds.map(id => (typeof id === 'string' ? new ObjectId(id) : id)) }
    }).toArray();

    // Get teacher information
    const teacherIds = timetableSlots
      .map(slot => slot.teacherId)
      .filter(id => id != null);

    const teachers = await db.collection('teachers').find({
      _id: { $in: teacherIds }
    }).toArray();

    const teacherMap = new Map();
    teachers.forEach(teacher => {
      teacherMap.set(teacher._id.toString(), teacher);
    });

    // Build days array for date range
    const days = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      const queryDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // Convert Sunday(0) to 7 for query

      // Get slots for this day
      const daySlots = timetableSlots.filter(slot => slot.dayOfWeek === queryDayOfWeek);

      // Sort slots by start time
      daySlots.sort((a, b) => {
        const timeA = a.startTime || '00:00';
        const timeB = b.startTime || '00:00';
        return timeA.localeCompare(timeB);
      });

      days.push({
        day: dayOfWeek,
        dayName: dayNames[dayOfWeek],
        date: new Date(currentDate).toISOString(),
        slots: daySlots.map(slot => formatTimetableSlot(slot, teacherMap))
      });

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.status(200).json({
      success: true,
      data: {
        weekStartDate: weekStartDate.toISOString(),
        weekEndDate: weekEndDate.toISOString(),
        days
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Error fetching timetable for date range',
        code: 'TIMETABLE_FETCH_ERROR',
        details: error.message
      }
    });
  }
};

module.exports = {
  getWeeklyTimetable,
  getDayTimetable,
  getTimetableByDateRange
};
