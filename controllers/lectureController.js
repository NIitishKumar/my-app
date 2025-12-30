const { getDatabase, ObjectId } = require('../db');

// Create new lecture
const createLecture = async (req, res) => {
  try {
    const db = getDatabase();
    const lectureData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('lectures').insertOne(lectureData);

    res.status(201).json({
      success: true,
      message: 'Lecture created successfully',
      data: { _id: result.insertedId, ...lectureData }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating lecture',
      error: error.message
    });
  }
};

// Get all lectures
const getAllLectures = async (req, res) => {
  try {
    const db = getDatabase();
    const lectures = await db.collection('lectures')
      .find({})
      .toArray();

    // Populate teacher and class details for each lecture
    const populatedLectures = await Promise.all(
      lectures.map(async (lecture) => {
        const populatedLecture = { ...lecture };

        // Populate teacher
        if (lecture.teacher) {
          const teacher = await db.collection('teachers').findOne({
            _id: typeof lecture.teacher === 'string' ? new ObjectId(lecture.teacher) : lecture.teacher,
            isActive: true
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

    res.status(200).json({
      success: true,
      count: populatedLectures.length,
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

// Get lecture by ID
const getLectureById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lecture ID'
      });
    }

    const lecture = await db.collection('lectures').findOne({ _id: new ObjectId(id) });

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Populate teacher details
    if (lecture.teacher) {
      const teacher = await db.collection('teachers').findOne({
        _id: typeof lecture.teacher === 'string' ? new ObjectId(lecture.teacher) : lecture.teacher,
        isActive: true
      });
      lecture.teacher = teacher;
    }

    // Populate class details
    if (lecture.classId) {
      const classData = await db.collection('classes').findOne({
        _id: typeof lecture.classId === 'string' ? new ObjectId(lecture.classId) : lecture.classId,
        isActive: true
      });
      lecture.classId = classData;
    }

    res.status(200).json({
      success: true,
      data: lecture
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lecture',
      error: error.message
    });
  }
};

// Update lecture
const updateLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lecture ID'
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.createdAt;

    const result = await db.collection('lectures').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Get updated lecture data with populated teacher and class
    const updatedLecture = await db.collection('lectures').findOne({
      _id: new ObjectId(id)
    });

    // Populate teacher details
    if (updatedLecture.teacher) {
      const teacher = await db.collection('teachers').findOne({
        _id: typeof updatedLecture.teacher === 'string' ? new ObjectId(updatedLecture.teacher) : updatedLecture.teacher,
        isActive: true
      });
      updatedLecture.teacher = teacher;
    }

    // Populate class details
    if (updatedLecture.classId) {
      const classData = await db.collection('classes').findOne({
        _id: typeof updatedLecture.classId === 'string' ? new ObjectId(updatedLecture.classId) : updatedLecture.classId,
        isActive: true
      });
      updatedLecture.classId = classData;
    }

    res.status(200).json({
      success: true,
      message: 'Lecture updated successfully',
      data: updatedLecture
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating lecture',
      error: error.message
    });
  }
};

// Delete lecture
const deleteLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lecture ID'
      });
    }

    const result = await db.collection('lectures').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lecture deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting lecture',
      error: error.message
    });
  }
};

module.exports = {
  createLecture,
  getAllLectures,
  getLectureById,
  updateLecture,
  deleteLecture
};