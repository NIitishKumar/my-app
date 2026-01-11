const subjectSchema = require('../schemas/subjectSchema');

/**
 * Subject Controller
 * Handles all subject-related operations
 */

// Create indexes lazily on first use
let indexesInitialized = false;

const ensureIndexes = async () => {
  if (!indexesInitialized) {
    try {
      await subjectSchema.createIndexes();
      indexesInitialized = true;
    } catch (err) {
      console.error('Error creating subject indexes:', err);
    }
  }
};

/**
 * Get all subjects with filtering and pagination
 * GET /api/admin/subjects
 */
const getAllSubjects = async (req, res) => {
  try {
    await ensureIndexes();

    const {
      search,
      classId,
      status,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const filters = {
      search,
      classId,
      status,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await subjectSchema.getAll(filters);

    res.status(200).json({
      success: true,
      count: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      totalPages: result.pagination.totalPages,
      data: result.subjects
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error fetching subjects',
        details: error.message
      }
    });
  }
};

/**
 * Get single subject by ID
 * GET /api/admin/subjects/:id
 */
const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await subjectSchema.getById(id);

    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    console.error('Error fetching subject:', error);

    if (error.message === 'Invalid subject ID format') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid subject ID format',
          details: error.message
        }
      });
    }

    if (error.message === 'Subject not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Subject not found',
          details: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error fetching subject',
        details: error.message
      }
    });
  }
};

/**
 * Create new subject
 * POST /api/admin/subjects
 */
const createSubject = async (req, res) => {
  try {
    const subjectData = req.body;

    const newSubject = await subjectSchema.create(subjectData);

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: newSubject
    });
  } catch (error) {
    console.error('Error creating subject:', error);

    if (error.message.includes('required') || error.message.includes('must be')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation error',
          details: error.message
        }
      });
    }

    if (error.message.includes('class IDs are invalid')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_CLASSES',
          message: 'Invalid class references',
          details: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error creating subject',
        details: error.message
      }
    });
  }
};

/**
 * Update subject
 * PUT /api/admin/subjects/:id
 */
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedSubject = await subjectSchema.update(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: updatedSubject
    });
  } catch (error) {
    console.error('Error updating subject:', error);

    if (error.message === 'Invalid subject ID format') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid subject ID format',
          details: error.message
        }
      });
    }

    if (error.message === 'Subject not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Subject not found',
          details: error.message
        }
      });
    }

    if (error.message.includes('required') || error.message.includes('must be')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation error',
          details: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error updating subject',
        details: error.message
      }
    });
  }
};

/**
 * Delete subject
 * DELETE /api/admin/subjects/:id
 */
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSubject = await subjectSchema.delete(id);

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully',
      data: deletedSubject
    });
  } catch (error) {
    console.error('Error deleting subject:', error);

    if (error.message === 'Invalid subject ID format') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid subject ID format',
          details: error.message
        }
      });
    }

    if (error.message === 'Subject not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Subject not found',
          details: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error deleting subject',
        details: error.message
      }
    });
  }
};

module.exports = {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
};
