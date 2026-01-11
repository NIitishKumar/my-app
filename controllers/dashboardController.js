const { getDatabase, ObjectId } = require('../db');

// Get complete dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const db = getDatabase();

    // Get total counts
    const totalStudents = await db.collection('students').countDocuments({ isActive: true });
    const totalTeachers = await db.collection('teachers').countDocuments({ isActive: true });
    const totalClasses = await db.collection('classes').countDocuments({ isActive: true });
    const totalLectures = await db.collection('lectures').countDocuments({ isActive: true });

    // Get student statistics
    const studentsByGender = await db.collection('students')
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$gender', count: { $sum: 1 } } }
      ])
      .toArray();

    // Get teacher statistics by department
    const teachersByDepartment = await db.collection('teachers')
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
      .toArray();

    // Get class statistics
    const classesByGrade = await db.collection('classes')
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$grade', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
      .toArray();

    // Get average class capacity
    const avgCapacityResult = await db.collection('classes')
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, avgCapacity: { $avg: '$capacity' }, avgEnrolled: { $avg: '$enrolled' } } }
      ])
      .toArray();

    // Get lecture statistics by type
    const lecturesByType = await db.collection('lectures')
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ])
      .toArray();

    // Get lecture statistics by subject
    const lecturesBySubject = await db.collection('lectures')
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$subject', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
      .toArray();

    // Get recent students (last 5)
    const recentStudents = await db.collection('students')
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .project({
        firstName: 1,
        lastName: 1,
        email: 1,
        studentId: 1,
        grade: 1,
        createdAt: 1
      })
      .toArray();

    // Get recent classes (last 5)
    const recentClasses = await db.collection('classes')
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .project({
        className: 1,
        grade: 1,
        roomNo: 1,
        capacity: 1,
        enrolled: 1,
        createdAt: 1
      })
      .toArray();

    // Get upcoming lectures (sorted by day of week) with populated teacher
    const upcomingLectures = await db.collection('lectures')
      .find({ isActive: true })
      .sort({ 'schedule.dayOfWeek': 1, 'schedule.startTime': 1 })
      .limit(10)
      .toArray();

    // Populate teacher details for upcoming lectures
    const populatedLectures = await Promise.all(
      upcomingLectures.map(async (lecture) => {
        const populatedLecture = { ...lecture };

        // Populate teacher
        if (lecture.teacher) {
          const teacher = await db.collection('teachers').findOne({
            _id: typeof lecture.teacher === 'string' ? new ObjectId(lecture.teacher) : lecture.teacher
          });
          populatedLecture.teacher = teacher;
        }

        // Populate class
        if (lecture.classId) {
          const classData = await db.collection('classes').findOne({
            _id: typeof lecture.classId === 'string' ? new ObjectId(lecture.classId) : lecture.classId,
            isActive: true
          });
          populatedLecture.classId = classData;
        }

        return populatedLecture;
      })
    );

    // Get enrollment trends (total enrolled vs capacity)
    const enrollmentStats = await db.collection('classes')
      .aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalCapacity: { $sum: '$capacity' },
            totalEnrolled: { $sum: '$enrolled' },
            availableSlots: { $sum: { $subtract: ['$capacity', '$enrolled'] } }
          }
        }
      ])
      .toArray();

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalStudents,
          totalTeachers,
          totalClasses,
          totalLectures
        },
        students: {
          total: totalStudents,
          byGender: studentsByGender,
          recent: recentStudents
        },
        teachers: {
          total: totalTeachers,
          byDepartment: teachersByDepartment
        },
        classes: {
          total: totalClasses,
          byGrade: classesByGrade,
          averageCapacity: avgCapacityResult[0]?.avgCapacity?.toFixed(1) || 0,
          averageEnrolled: avgCapacityResult[0]?.avgEnrolled?.toFixed(1) || 0,
          enrollment: enrollmentStats[0] || {
            totalCapacity: 0,
            totalEnrolled: 0,
            availableSlots: 0
          },
          recent: recentClasses
        },
        lectures: {
          total: totalLectures,
          byType: lecturesByType,
          bySubject: lecturesBySubject,
          upcoming: populatedLectures
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// Get quick overview stats (lightweight version)
const getQuickStats = async (req, res) => {
  try {
    const db = getDatabase();

    const totalStudents = await db.collection('students').countDocuments({ isActive: true });
    const totalTeachers = await db.collection('teachers').countDocuments({ isActive: true });
    const totalClasses = await db.collection('classes').countDocuments({ isActive: true });
    const totalLectures = await db.collection('lectures').countDocuments({ isActive: true });

    // Get total enrolled students across all classes
    const totalEnrolledResult = await db.collection('classes')
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, totalEnrolled: { $sum: '$enrolled' } } }
      ])
      .toArray();

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalLectures,
        totalEnrolled: totalEnrolledResult[0]?.totalEnrolled || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quick stats',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getQuickStats
};
