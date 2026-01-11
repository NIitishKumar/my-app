const { body, param, query, validationResult } = require('express-validator');
const ATTENDANCE_CONFIG = require('../config/attendanceConfig');

/**
 * Validation Middleware
 * Uses express-validator for input validation
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

    return res.status(ATTENDANCE_CONFIG.HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        code: ATTENDANCE_CONFIG.ERROR_CODES.VALIDATION_ERROR,
        message: 'Validation failed',
        details
      }
    });
  }

  next();
};

/**
 * Validate ObjectId parameter
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
 * Validate date parameter
 */
const validateDateParam = (paramName) => {
  return [
    param(paramName)
      .notEmpty()
      .withMessage(`${paramName} is required`)
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage(`${paramName} must be in YYYY-MM-DD format`)
      .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
        return true;
      })
      .withMessage(`Invalid ${paramName}`),
    handleValidationErrors
  ];
};

/**
 * Validate attendance creation
 */
const validateAttendanceCreation = [
  body('date')
    .trim()
    .notEmpty()
    .withMessage('Date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format (e.g., 2026-01-11)')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (date > today) {
        throw new Error('Date cannot be in the future');
      }
      return true;
    })
    .withMessage('Date cannot be in the future'),

  body('students')
    .notEmpty()
    .withMessage('Students array is required')
    .isArray({ min: 1, max: ATTENDANCE_CONFIG.MAX_STUDENTS_PER_RECORD })
    .withMessage(`Students array must have between 1 and ${ATTENDANCE_CONFIG.MAX_STUDENTS_PER_RECORD} students`),

  body('students.*.studentId')
    .trim()
    .notEmpty()
    .withMessage('Student ID is required and must be a valid MongoDB ObjectId (24-character hexadecimal string)')
    .isMongoId()
    .withMessage('Invalid student ID format: must be a 24-character hexadecimal string (e.g., 507f1f77bcf86cd799439011)'),

  body('students.*.status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(ATTENDANCE_CONFIG.STATUSES))
    .withMessage(`Status must be one of: ${Object.values(ATTENDANCE_CONFIG.STATUSES).join(', ')}`),

  body('students.*.remarks')
    .optional()
    .isString()
    .isLength({ max: ATTENDANCE_CONFIG.MAX_REMARKS_LENGTH })
    .withMessage(`Remarks cannot exceed ${ATTENDANCE_CONFIG.MAX_REMARKS_LENGTH} characters`),

  body('lectureId')
    .optional()
    .isMongoId()
    .withMessage('Invalid lecture ID format'),

  handleValidationErrors
];

/**
 * Validate attendance update
 */
const validateAttendanceUpdate = [
  body('date')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (date > today) {
        throw new Error('Date cannot be in the future');
      }
      return true;
    })
    .withMessage('Date cannot be in the future'),

  body('students')
    .optional()
    .isArray({ min: 1, max: ATTENDANCE_CONFIG.MAX_STUDENTS_PER_RECORD })
    .withMessage(`Students array must have between 1 and ${ATTENDANCE_CONFIG.MAX_STUDENTS_PER_RECORD} students`),

  body('students.*.studentId')
    .if(body('students').exists())
    .notEmpty()
    .withMessage('Student ID is required')
    .isMongoId()
    .withMessage('Invalid student ID format'),

  body('students.*.status')
    .if(body('students').exists())
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(ATTENDANCE_CONFIG.STATUSES))
    .withMessage(`Status must be one of: ${Object.values(ATTENDANCE_CONFIG.STATUSES).join(', ')}`),

  body('students.*.remarks')
    .optional()
    .isString()
    .isLength({ max: ATTENDANCE_CONFIG.MAX_REMARKS_LENGTH })
    .withMessage(`Remarks cannot exceed ${ATTENDANCE_CONFIG.MAX_REMARKS_LENGTH} characters`),

  body('version')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Version must be a non-negative integer'),

  handleValidationErrors
];

/**
 * Validate query parameters for attendance listing
 */
const validateAttendanceQuery = [
  query('classId')
    .optional()
    .isMongoId()
    .withMessage('Invalid class ID format'),

  query('startDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Start date must be in YYYY-MM-DD format'),

  query('endDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('End date must be in YYYY-MM-DD format'),

  query('lectureId')
    .optional()
    .isMongoId()
    .withMessage('Invalid lecture ID format'),

  query('status')
    .optional()
    .isIn(Object.values(ATTENDANCE_CONFIG.STATUSES))
    .withMessage(`Status must be one of: ${Object.values(ATTENDANCE_CONFIG.STATUSES).join(', ')}`),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: ATTENDANCE_CONFIG.MAX_LIMIT })
    .withMessage(`Limit must be between 1 and ${ATTENDANCE_CONFIG.MAX_LIMIT}`),

  handleValidationErrors
];

/**
 * Validate statistics query parameters
 */
const validateStatisticsQuery = [
  query('startDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Start date must be in YYYY-MM-DD format'),

  query('endDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('End date must be in YYYY-MM-DD format'),

  handleValidationErrors
];

/**
 * Validate export query parameters
 */
const validateExportQuery = [
  query('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Start date must be in YYYY-MM-DD format'),

  query('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('End date must be in YYYY-MM-DD format'),

  query('format')
    .optional()
    .isIn(['excel', 'csv'])
    .withMessage('Format must be either "excel" or "csv"'),

  query('classId')
    .optional()
    .isMongoId()
    .withMessage('Invalid class ID format'),

  handleValidationErrors
];

/**
 * Validate lock/unlock request
 */
const validateLockRequest = [
  body('isLocked')
    .notEmpty()
    .withMessage('isLocked field is required')
    .isBoolean()
    .withMessage('isLocked must be a boolean value'),

  handleValidationErrors
];

/**
 * Validate bulk import request
 */
const validateBulkImport = [
  body('records')
    .notEmpty()
    .withMessage('Records array is required')
    .isArray({ min: 1 })
    .withMessage('Records must be a non-empty array'),

  body('records.*.classId')
    .notEmpty()
    .withMessage('Class ID is required')
    .isMongoId()
    .withMessage('Invalid class ID format'),

  body('records.*.date')
    .notEmpty()
    .withMessage('Date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format'),

  body('records.*.students')
    .notEmpty()
    .withMessage('Students array is required')
    .isArray({ min: 1 })
    .withMessage('Students must be a non-empty array'),

  body('records.*.students.*.studentId')
    .notEmpty()
    .withMessage('Student ID is required')
    .isMongoId()
    .withMessage('Invalid student ID format'),

  body('records.*.students.*.status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(ATTENDANCE_CONFIG.STATUSES))
    .withMessage(`Status must be one of: ${Object.values(ATTENDANCE_CONFIG.STATUSES).join(', ')}`),

  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateObjectId,
  validateDateParam,
  validateAttendanceCreation,
  validateAttendanceUpdate,
  validateAttendanceQuery,
  validateStatisticsQuery,
  validateExportQuery,
  validateLockRequest,
  validateBulkImport
};
