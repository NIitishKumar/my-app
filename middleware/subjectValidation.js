const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation Middleware for Subject Endpoints
 */

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const details = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));

    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details
      }
    });
  }

  next();
};

/**
 * Validate MongoDB ObjectId parameter
 */
const validateObjectId = (paramName) => {
  return [
    param(paramName)
      .notEmpty()
      .withMessage(`${paramName} is required`)
      .isMongoId()
      .withMessage(`Invalid ${paramName} format`),
    handleValidationErrors
  ];
};

/**
 * Validate subject creation
 */
const validateSubjectCreation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Author must be between 2 and 100 characters'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('Price must be a number between 0 and 999999.99'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('classes')
    .isArray({ min: 1 })
    .withMessage('Classes must be a non-empty array')
    .custom((value) => {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error('At least one class is required');
      }
      return true;
    }),

  body('classes.*')
    .notEmpty()
    .withMessage('Class ID cannot be empty')
    .isMongoId()
    .withMessage('Each class ID must be a valid MongoDB ObjectId'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),

  handleValidationErrors
];

/**
 * Validate subject update
 */
const validateSubjectUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('author')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Author must be between 2 and 100 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('Price must be a number between 0 and 999999.99'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('classes')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Classes must be a non-empty array'),

  body('classes.*')
    .if(body('classes').exists())
    .notEmpty()
    .withMessage('Class ID cannot be empty')
    .isMongoId()
    .withMessage('Each class ID must be a valid MongoDB ObjectId'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),

  handleValidationErrors
];

/**
 * Validate subject query parameters
 */
const validateSubjectQuery = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term cannot exceed 100 characters'),

  query('classId')
    .optional()
    .isMongoId()
    .withMessage('Invalid class ID format'),

  query('status')
    .optional()
    .isIn(['active', 'inactive', 'all'])
    .withMessage('Status must be one of: active, inactive, all'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),

  query('sortBy')
    .optional()
    .isIn(['name', 'author', 'price', 'createdAt'])
    .withMessage('Sort field must be one of: name, author, price, createdAt'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateObjectId,
  validateSubjectCreation,
  validateSubjectUpdate,
  validateSubjectQuery
};
