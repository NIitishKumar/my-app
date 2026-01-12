const { body, param, query } = require('express-validator');
const { validationResult } = require('express-validator');

/**
 * Validation middleware for notices
 */

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().reduce((acc, error) => {
        acc[error.path] = error.msg;
        return acc;
      }, {})
    });
  }
  next();
};

/**
 * Validate Object ID in params
 */
const validateObjectId = (paramName) => {
  return [
    param(paramName)
      .isMongoId()
      .withMessage(`Invalid ${paramName} format`),
    handleValidationErrors
  ];
};

/**
 * Validate notice creation
 */
const validateNoticeCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),

  body('audience')
    .trim()
    .notEmpty()
    .withMessage('Audience is required')
    .isIn(['ALL', 'TEACHERS', 'STUDENTS', 'PARENTS'])
    .withMessage('Audience must be one of: ALL, TEACHERS, STUDENTS, PARENTS'),

  body('priority')
    .trim()
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(['NORMAL', 'IMPORTANT', 'URGENT'])
    .withMessage('Priority must be one of: NORMAL, IMPORTANT, URGENT'),

  body('classIds')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Class IDs must be an array with at least one element'),

  body('classIds.*')
    .isMongoId()
    .withMessage('Each class ID must be a valid MongoDB ObjectId'),

  body('publishAt')
    .optional()
    .isISO8601()
    .withMessage('PublishAt must be a valid ISO 8601 datetime'),

  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('ExpiresAt must be a valid ISO 8601 datetime'),

  handleValidationErrors
];

/**
 * Validate notice update
 */
const validateNoticeUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),

  body('audience')
    .optional()
    .trim()
    .isIn(['ALL', 'TEACHERS', 'STUDENTS', 'PARENTS'])
    .withMessage('Audience must be one of: ALL, TEACHERS, STUDENTS, PARENTS'),

  body('priority')
    .optional()
    .trim()
    .isIn(['NORMAL', 'IMPORTANT', 'URGENT'])
    .withMessage('Priority must be one of: NORMAL, IMPORTANT, URGENT'),

  body('classIds')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Class IDs must be an array with at least one element'),

  body('classIds.*')
    .optional()
    .isMongoId()
    .withMessage('Each class ID must be a valid MongoDB ObjectId'),

  body('publishAt')
    .optional()
    .isISO8601()
    .withMessage('PublishAt must be a valid ISO 8601 datetime'),

  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('ExpiresAt must be a valid ISO 8601 datetime'),

  handleValidationErrors
];

/**
 * Validate notice query parameters
 */
const validateNoticeQuery = [
  query('audience')
    .optional()
    .trim()
    .isIn(['ALL', 'TEACHERS', 'STUDENTS', 'PARENTS'])
    .withMessage('Audience must be one of: ALL, TEACHERS, STUDENTS, PARENTS'),

  query('status')
    .optional()
    .trim()
    .isIn(['PUBLISHED', 'SCHEDULED', 'DRAFT'])
    .withMessage('Status must be one of: PUBLISHED, SCHEDULED, DRAFT'),

  query('priority')
    .optional()
    .trim()
    .isIn(['NORMAL', 'IMPORTANT', 'URGENT'])
    .withMessage('Priority must be one of: NORMAL, IMPORTANT, URGENT'),

  handleValidationErrors
];

module.exports = {
  validateObjectId,
  validateNoticeCreation,
  validateNoticeUpdate,
  validateNoticeQuery
};
