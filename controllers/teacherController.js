const { getDatabase, ObjectId } = require('../db');

// Create new teacher
const createTeacher = async (req, res) => {
  try {
    const db = getDatabase();
    const teacherData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    const result = await db.collection('teachers').insertOne(teacherData);

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: { _id: result.insertedId, ...teacherData }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email or Employee ID already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating teacher',
      error: error.message
    });
  }
};

// Get all teachers
const getAllTeachers = async (req, res) => {
  try {
    const db = getDatabase();
    const { page = 1, limit = 10, department, status, search } = req.query;

    // Build query filter
    const filter = {};
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    filter.isActive = true;

    // Get teachers with pagination
    const teachers = await db.collection('teachers')
      .find(filter)
      .sort({ createdAt: -1 })
      .project({
        firstName: 1,
        lastName: 1,
        email: 1,
        employeeId: 1,
        phone: 1,
        department: 1,
        qualification: 1,
        specialization: 1,
        subjects: 1,
        status: 1,
        employmentType: 1
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .toArray();

    // Get total count for pagination
    const total = await db.collection('teachers').countDocuments(filter);

    res.status(200).json({
      success: true,
      count: teachers.length,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      data: teachers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers',
      error: error.message
    });
  }
};

// Get teacher by ID
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid teacher ID'
      });
    }

    const teacher = await db.collection('teachers').findOne({
      _id: new ObjectId(id),
      isActive: true
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher',
      error: error.message
    });
  }
};

// Update teacher
const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid teacher ID'
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.employeeId; // Employee ID should not be updated

    const result = await db.collection('teachers').updateOne(
      { _id: new ObjectId(id), isActive: true },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Get updated teacher data
    const updatedTeacher = await db.collection('teachers').findOne({
      _id: new ObjectId(id)
    });

    res.status(200).json({
      success: true,
      message: 'Teacher updated successfully',
      data: updatedTeacher
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating teacher',
      error: error.message
    });
  }
};

// Delete teacher (soft delete)
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid teacher ID'
      });
    }

    const result = await db.collection('teachers').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isActive: false,
          status: 'inactive',
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting teacher',
      error: error.message
    });
  }
};

// Hard delete (permanent deletion)
const hardDeleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid teacher ID'
      });
    }

    const result = await db.collection('teachers').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Teacher permanently deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error permanently deleting teacher',
      error: error.message
    });
  }
};

// Get teachers by department
const getTeachersByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const db = getDatabase();

    const teachers = await db.collection('teachers')
      .find({
        department: { $regex: new RegExp(department, 'i') },
        isActive: true
      })
      .project({
        firstName: 1,
        lastName: 1,
        email: 1,
        employeeId: 1,
        phone: 1,
        qualification: 1,
        specialization: 1,
        subjects: 1,
        experience: 1
      })
      .sort({ lastName: 1, firstName: 1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers by department',
      error: error.message
    });
  }
};

// Get teacher statistics
const getTeacherStats = async (req, res) => {
  try {
    const db = getDatabase();

    // Total teachers
    const totalTeachers = await db.collection('teachers').countDocuments({ isActive: true });

    // Teachers by department
    const teachersByDepartment = await db.collection('teachers')
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
      .toArray();

    // Teachers by status
    const teachersByStatus = await db.collection('teachers')
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
      .toArray();

    // Average experience
    const avgExperienceResult = await db.collection('teachers')
      .aggregate([
        { $match: { isActive: true, experience: { $exists: true, $ne: null } } },
        { $group: { _id: null, avgExperience: { $avg: '$experience' } } }
      ])
      .toArray();

    res.status(200).json({
      success: true,
      data: {
        totalTeachers,
        teachersByDepartment,
        teachersByStatus,
        averageExperience: avgExperienceResult[0]?.avgExperience?.toFixed(1) || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher statistics',
      error: error.message
    });
  }
};

// Add class to teacher
const addClassToTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { classId } = req.body;
    const db = getDatabase();

    if (!ObjectId.isValid(id) || !ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid teacher ID or class ID'
      });
    }

    // Check if teacher exists
    const teacher = await db.collection('teachers').findOne({
      _id: new ObjectId(id),
      isActive: true
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Check if class exists
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

    // Check if class is already assigned to teacher
    if (teacher.classes && teacher.classes.some(clsId => clsId.toString() === classId)) {
      return res.status(400).json({
        success: false,
        message: 'Class already assigned to this teacher'
      });
    }

    // Add class to teacher
    const result = await db.collection('teachers').updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { classes: new ObjectId(classId) },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class assigned to teacher successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning class to teacher',
      error: error.message
    });
  }
};

// Remove class from teacher
const removeClassFromTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { classId } = req.body;
    const db = getDatabase();

    if (!ObjectId.isValid(id) || !ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid teacher ID or class ID'
      });
    }

    // Remove class from teacher
    const result = await db.collection('teachers').updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: { classes: new ObjectId(classId) },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class removed from teacher successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing class from teacher',
      error: error.message
    });
  }
};

// Get teacher with populated classes
const getTeacherWithClasses = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid teacher ID'
      });
    }

    const teacher = await db.collection('teachers').findOne({
      _id: new ObjectId(id),
      isActive: true
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Populate classes if they exist
    if (teacher.classes && teacher.classes.length > 0) {
      const classIds = teacher.classes.map(id =>
        typeof id === 'string' ? new ObjectId(id) : id
      );
      const classes = await db.collection('classes')
        .find({ _id: { $in: classIds } })
        .project({
          className: 1,
          grade: 1,
          roomNo: 1,
          subjects: 1,
          schedule: 1
        })
        .toArray();
      teacher.classes = classes;
    }

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher with classes',
      error: error.message
    });
  }
};

module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  hardDeleteTeacher,
  getTeachersByDepartment,
  getTeacherStats,
  addClassToTeacher,
  removeClassFromTeacher,
  getTeacherWithClasses
};