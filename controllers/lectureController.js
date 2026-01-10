const { getDatabase, ObjectId } = require('../db');

// Create new lecture
const createLecture = async (req, res) => {
  try {
    const db = getDatabase();
    const { classId, ...restOfBody } = req.body;

    const lectureData = {
      ...restOfBody,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Validate classId if provided
    if (classId) {
      if (!ObjectId.isValid(classId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid class ID'
        });
      }

      // Check if class exists
      const classData = await db.collection('classes').findOne({
        _id: new ObjectId(classId)
      });

      if (!classData) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      lectureData.classId = new ObjectId(classId);
    }

    const result = await db.collection('lectures').insertOne(lectureData);

    // If classId is provided, add lecture to the class's lectures array
    if (classId) {
      await db.collection('classes').updateOne(
        { _id: new ObjectId(classId) },
        {
          $push: { lectures: result.insertedId },
          $set: { updatedAt: new Date() }
        }
      );
    }

    // Populate teacher and class for response
    const populatedLecture = { ...lectureData, _id: result.insertedId };

    if (lectureData.teacher) {
      const teacher = await db.collection('teachers').findOne({
        _id: typeof lectureData.teacher === 'string' ? new ObjectId(lectureData.teacher) : lectureData.teacher,
        isActive: true
      });
      populatedLecture.teacher = teacher;
    }

    if (lectureData.classId) {
      const classData = await db.collection('classes').findOne({
        _id: lectureData.classId,
        isActive: true
      });
      populatedLecture.classId = classData;
    }

    res.status(201).json({
      success: true,
      message: 'Lecture created successfully',
      data: populatedLecture
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
    const { classId, ...restOfBody } = req.body;
    const db = getDatabase();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lecture ID'
      });
    }

    // Get current lecture to check for classId changes
    const currentLecture = await db.collection('lectures').findOne({
      _id: new ObjectId(id)
    });

    if (!currentLecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    const updateData = {
      ...restOfBody,
      updatedAt: new Date()
    };

    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.createdAt;

    // Handle classId change
    if (classId !== undefined && classId !== null) {
      if (!ObjectId.isValid(classId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid class ID'
        });
      }

      // Check if new class exists
      const classData = await db.collection('classes').findOne({
        _id: new ObjectId(classId)
      });

      if (!classData) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      // Remove lecture from old class if classId is changing
      if (currentLecture.classId && currentLecture.classId.toString() !== classId) {
        await db.collection('classes').updateOne(
          { _id: currentLecture.classId },
          {
            $pull: { lectures: new ObjectId(id) },
            $set: { updatedAt: new Date() }
          }
        );
      }

      // Add lecture to new class if not already there
      await db.collection('classes').updateOne(
        { _id: new ObjectId(classId) },
        {
          $addToSet: { lectures: new ObjectId(id) },
          $set: { updatedAt: new Date() }
        }
      );

      updateData.classId = new ObjectId(classId);
    }

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

    // Get lecture before deleting to remove from class
    const lecture = await db.collection('lectures').findOne({
      _id: new ObjectId(id)
    });

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Remove lecture from class if it has a classId
    if (lecture.classId) {
      await db.collection('classes').updateOne(
        { _id: lecture.classId },
        {
          $pull: { lectures: new ObjectId(id) },
          $set: { updatedAt: new Date() }
        }
      );
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