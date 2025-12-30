const { getDatabase, ObjectId } = require('../db');

// Create new lecture with simplified fields
const createSimpleLecture = async (req, res) => {
  try {
    const db = getDatabase();
    const {
      title,
      topic,
      class: classId,
      assignedTeacher,
      date,
      time,
      description
    } = req.body;

    // Validation
    if (!title || !topic || !classId || !assignedTeacher || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, topic, class, assignedTeacher, date, time'
      });
    }

    // Validate date format
    const lectureDate = new Date(date);
    if (isNaN(lectureDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD format'
      });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time format. Please use HH:MM format (24-hour)'
      });
    }

    // Validate class exists
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

    // Validate teacher exists
    const teacherData = await db.collection('teachers').findOne({
      _id: new ObjectId(assignedTeacher),
      isActive: true
    });

    if (!teacherData) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    const lectureData = {
      title: title.trim(),
      topic: topic.trim(),
      class: new ObjectId(classId),
      assignedTeacher: new ObjectId(assignedTeacher),
      date: lectureDate,
      time: time.trim(),
      description: description ? description.trim() : '',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    const result = await db.collection('lectures').insertOne(lectureData);

    // Populate class and teacher info for response
    const populatedLecture = {
      ...lectureData,
      _id: result.insertedId,
      class: {
        _id: classData._id,
        className: classData.className,
        grade: classData.grade,
        roomNo: classData.roomNo
      },
      assignedTeacher: {
        _id: teacherData._id,
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        email: teacherData.email,
        employeeId: teacherData.employeeId
      }
    };

    res.status(201).json({
      success: true,
      message: 'Lecture created successfully',
      data: populatedLecture
    });
  } catch (error) {
    if (error.message.includes('ObjectId')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class or teacher ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating lecture',
      error: error.message
    });
  }
};

// Get all lectures with class and teacher info
const getAllSimpleLectures = async (req, res) => {
  try {
    const db = getDatabase();
    const { page = 1, limit = 10, classId, teacherId, date } = req.query;

    // Build query filter
    const filter = { isActive: true };
    if (classId) filter.class = new ObjectId(classId);
    if (teacherId) filter.assignedTeacher = new ObjectId(teacherId);
    if (date) {
      const queryDate = new Date(date);
      const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // Get lectures with pagination
    const lectures = await db.collection('lectures')
      .find(filter)
      .sort({ date: 1, time: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .toArray();

    // Populate class and teacher data
    const populatedLectures = await Promise.all(
      lectures.map(async (lecture) => {
        const populatedLecture = { ...lecture };

        // Get class info
        if (lecture.class) {
          const classData = await db.collection('classes').findOne({
            _id: lecture.class,
            isActive: true
          });
          if (classData) {
            populatedLecture.classInfo = {
              _id: classData._id,
              className: classData.className,
              grade: classData.grade,
              roomNo: classData.roomNo
            };
          }
        }

        // Get teacher info
        if (lecture.assignedTeacher) {
          const teacherData = await db.collection('teachers').findOne({
            _id: lecture.assignedTeacher,
            isActive: true
          });
          if (teacherData) {
            populatedLecture.teacherInfo = {
              _id: teacherData._id,
              firstName: teacherData.firstName,
              lastName: teacherData.lastName,
              email: teacherData.email,
              employeeId: teacherData.employeeId,
              department: teacherData.department
            };
          }
        }

        return populatedLecture;
      })
    );

    // Get total count for pagination
    const total = await db.collection('lectures').countDocuments(filter);

    res.status(200).json({
      success: true,
      count: populatedLectures.length,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      data: populatedLectures
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lectures',
      error: error.message
    });
  }
};

// Get lecture by ID with populated data
const getSimpleLectureById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lecture ID'
      });
    }

    const lecture = await db.collection('lectures').findOne({
      _id: new ObjectId(id),
      isActive: true
    });

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Populate class and teacher data
    let populatedLecture = { ...lecture };

    // Get class info
    if (lecture.class) {
      const classData = await db.collection('classes').findOne({
        _id: lecture.class,
        isActive: true
      });
      if (classData) {
        populatedLecture.classInfo = {
          _id: classData._id,
          className: classData.className,
          grade: classData.grade,
          roomNo: classData.roomNo,
          subjects: classData.subjects
        };
      }
    }

    // Get teacher info
    if (lecture.assignedTeacher) {
      const teacherData = await db.collection('teachers').findOne({
        _id: lecture.assignedTeacher,
        isActive: true
      });
      if (teacherData) {
        populatedLecture.teacherInfo = {
          _id: teacherData._id,
          firstName: teacherData.firstName,
          lastName: teacherData.lastName,
          email: teacherData.email,
          employeeId: teacherData.employeeId,
          department: teacherData.department,
          qualification: teacherData.qualification,
          experience: teacherData.experience
        };
      }
    }

    res.status(200).json({
      success: true,
      data: populatedLecture
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lecture',
      error: error.message
    });
  }
};

module.exports = {
  createSimpleLecture,
  getAllSimpleLectures,
  getSimpleLectureById
};