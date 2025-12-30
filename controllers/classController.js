const { getDatabase, ObjectId } = require('../db');

// Get all classes
const getAllClasses = async (req, res) => {
  try {
    const db = getDatabase();
    const classes = await db.collection('classes')
      .find({})
      .toArray();

    // Populate students and lectures for each class
    const populatedClasses = await Promise.all(
      classes.map(async (classItem) => {
        const populatedClass = { ...classItem };

        // Populate students if they exist
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
          populatedClass.students = students;
        }

        // Populate lectures if they exist
        if (classItem.lectures && classItem.lectures.length > 0) {
          const lectureIds = classItem.lectures.map(id =>
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
          populatedClass.lectures = lectures;
        }

        return populatedClass;
      })
    );

    res.status(200).json({
      success: true,
      count: populatedClasses.length,
      data: populatedClasses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching classes',
      error: error.message
    });
  }
};

// Get class by ID with populated references
const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class ID'
      });
    }

    const classData = await db.collection('classes').findOne({ _id: new ObjectId(id) });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Populate students if they exist
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
      classData.students = students;
    }

    // Populate lectures if they exist
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
      classData.lectures = lectures;
    }

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching class',
      error: error.message
    });
  }
};

// Create new class
const createClass = async (req, res) => {
  try {
    const db = getDatabase();
    const classData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Validate enrolled count doesn't exceed capacity
    if (classData.enrolled > classData.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Enrolled students cannot exceed class capacity'
      });
    }

    // Validate student references if provided
    if (classData.students && classData.students.length > 0) {
      const studentIds = classData.students.map(id => new ObjectId(id));
      const existingStudents = await db.collection('students')
        .find({ _id: { $in: studentIds } })
        .toArray();

      if (existingStudents.length !== studentIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more student references are invalid'
        });
      }
    }

    // Validate lecture references if provided
    if (classData.lectures && classData.lectures.length > 0) {
      const lectureIds = classData.lectures.map(id => new ObjectId(id));
      const existingLectures = await db.collection('lectures')
        .find({ _id: { $in: lectureIds } })
        .toArray();

      if (existingLectures.length !== lectureIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more lecture references are invalid'
        });
      }
    }

    const result = await db.collection('classes').insertOne(classData);

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: { _id: result.insertedId, ...classData }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Class name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating class',
      error: error.message
    });
  }
};

// Update class
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class ID'
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    // Validate enrolled count doesn't exceed capacity
    if (updateData.enrolled && updateData.capacity && updateData.enrolled > updateData.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Enrolled students cannot exceed class capacity'
      });
    }

    // Validate student references if provided
    if (updateData.students && updateData.students.length > 0) {
      const studentIds = updateData.students.map(id => new ObjectId(id));
      const existingStudents = await db.collection('students')
        .find({ _id: { $in: studentIds } })
        .toArray();

      if (existingStudents.length !== studentIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more student references are invalid'
        });
      }
    }

    // Validate lecture references if provided
    if (updateData.lectures && updateData.lectures.length > 0) {
      const lectureIds = updateData.lectures.map(id => new ObjectId(id));
      const existingLectures = await db.collection('lectures')
        .find({ _id: { $in: lectureIds } })
        .toArray();

      if (existingLectures.length !== lectureIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more lecture references are invalid'
        });
      }
    }

    const result = await db.collection('classes').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      data: updateData
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Class name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating class',
      error: error.message
    });
  }
};

// Delete class
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class ID'
      });
    }

    const result = await db.collection('classes').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting class',
      error: error.message
    });
  }
};

// Add student to class
const addStudentToClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;
    const db = getDatabase();

    if (!ObjectId.isValid(id) || !ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class ID or student ID'
      });
    }

    // Check if student exists
    const student = await db.collection('students').findOne({ _id: new ObjectId(studentId) });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get current class
    const classData = await db.collection('classes').findOne({ _id: new ObjectId(id) });
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if student is already enrolled
    if (classData.students && classData.students.includes(new ObjectId(studentId))) {
      return res.status(400).json({
        success: false,
        message: 'Student is already enrolled in this class'
      });
    }

    // Check capacity
    const currentEnrolled = classData.enrolled || 0;
    if (currentEnrolled >= classData.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Class has reached maximum capacity'
      });
    }

    // Add student to class
    const result = await db.collection('classes').updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { students: new ObjectId(studentId) },
        $inc: { enrolled: 1 },
        $set: { updatedAt: new Date() }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Student added to class successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding student to class',
      error: error.message
    });
  }
};

// Remove student from class
const removeStudentFromClass = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(id) || !ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class ID or student ID'
      });
    }

    const result = await db.collection('classes').updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: { students: new ObjectId(studentId) },
        $inc: { enrolled: -1 },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student removed from class successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing student from class',
      error: error.message
    });
  }
};

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass
};