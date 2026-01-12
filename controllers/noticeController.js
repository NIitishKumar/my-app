const noticeSchema = require('../schemas/noticeSchema');

/**
 * Notice Controller
 * Handles all notice-related operations
 */

// Create indexes lazily on first use
let indexesInitialized = false;

const ensureIndexes = async () => {
  if (!indexesInitialized) {
    try {
      await noticeSchema.createIndexes();
      indexesInitialized = true;
    } catch (err) {
      console.error('Error creating notice indexes:', err);
    }
  }
};

/**
 * Get all notices with filtering
 * GET /api/admin/notices
 */
const getAllNotices = async (req, res) => {
  try {
    await ensureIndexes();

    const {
      audience,
      status,
      priority
    } = req.query;

    const filters = {
      audience,
      status,
      priority
    };

    const result = await noticeSchema.getAll(filters);

    res.status(200).json({
      success: true,
      count: result.count,
      data: result.notices
    });
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notices',
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
};

/**
 * Get single notice by ID
 * GET /api/admin/notices/:id
 */
const getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await noticeSchema.getById(id);

    res.status(200).json({
      success: true,
      data: notice
    });
  } catch (error) {
    console.error('Error fetching notice:', error);

    if (error.message === 'Invalid notice ID format') {
      return res.status(400).json({
        success: false,
        message: 'Invalid notice ID format',
        error: {
          code: 'INVALID_ID',
          message: error.message
        }
      });
    }

    if (error.message === 'Notice not found') {
      return res.status(404).json({
        success: false,
        message: 'Notice not found',
        error: {
          code: 'NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching notice',
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
};

/**
 * Create new notice
 * POST /api/admin/notices
 */
const createNotice = async (req, res) => {
  try {
    const noticeData = req.body;
    const userId = req.user.id; // From auth middleware

    const newNotice = await noticeSchema.create(noticeData, userId);

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: newNotice
    });
  } catch (error) {
    console.error('Error creating notice:', error);

    if (error.message.includes('required') || error.message.includes('must be')) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating notice',
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
};

/**
 * Update notice
 * PUT /api/admin/notices/:id
 */
const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedNotice = await noticeSchema.update(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Notice updated successfully',
      data: updatedNotice
    });
  } catch (error) {
    console.error('Error updating notice:', error);

    if (error.message === 'Invalid notice ID format') {
      return res.status(400).json({
        success: false,
        message: 'Invalid notice ID format',
        error: {
          code: 'INVALID_ID',
          message: error.message
        }
      });
    }

    if (error.message === 'Notice not found') {
      return res.status(404).json({
        success: false,
        message: 'Notice not found',
        error: {
          code: 'NOT_FOUND',
          message: error.message
        }
      });
    }

    if (error.message.includes('required') || error.message.includes('must be')) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating notice',
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
};

/**
 * Delete notice
 * DELETE /api/admin/notices/:id
 */
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNotice = await noticeSchema.delete(id);

    res.status(200).json({
      success: true,
      message: 'Notice deleted successfully',
      data: deletedNotice
    });
  } catch (error) {
    console.error('Error deleting notice:', error);

    if (error.message === 'Invalid notice ID format') {
      return res.status(400).json({
        success: false,
        message: 'Invalid notice ID format',
        error: {
          code: 'INVALID_ID',
          message: error.message
        }
      });
    }

    if (error.message === 'Notice not found') {
      return res.status(404).json({
        success: false,
        message: 'Notice not found',
        error: {
          code: 'NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting notice',
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
};

module.exports = {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice
};
