const ATTENDANCE_CONFIG = require('../config/attendanceConfig');

/**
 * Error Response Formatter
 * Formats errors according to the specification
 */
const errorResponse = (code, message, details = null) => {
  const error = {
    success: false,
    error: {
      code,
      message
    }
  };

  if (details && details.length > 0) {
    error.error.details = details;
  }

  return error;
};

/**
 * Validation Error Handler
 * Handles express-validator validation errors
 */
const ValidationError = (message, details = []) => {
  const error = new Error(message);
  error.code = ATTENDANCE_CONFIG.ERROR_CODES.VALIDATION_ERROR;
  error.status = ATTENDANCE_CONFIG.HTTP_STATUS.BAD_REQUEST;
  error.details = details;
  return error;
};

/**
 * Unauthorized Error
 */
const UnauthorizedError = (message = 'Authentication required') => {
  const error = new Error(message);
  error.code = ATTENDANCE_CONFIG.ERROR_CODES.UNAUTHORIZED;
  error.status = ATTENDANCE_CONFIG.HTTP_STATUS.UNAUTHORIZED;
  return error;
};

/**
 * Forbidden Error
 */
const ForbiddenError = (message = 'You do not have permission to access this resource') => {
  const error = new Error(message);
  error.code = ATTENDANCE_CONFIG.ERROR_CODES.FORBIDDEN;
  error.status = ATTENDANCE_CONFIG.HTTP_STATUS.FORBIDDEN;
  return error;
};

/**
 * Not Found Error
 */
const NotFoundError = (message = 'Resource not found') => {
  const error = new Error(message);
  error.code = ATTENDANCE_CONFIG.ERROR_CODES.NOT_FOUND;
  error.status = ATTENDANCE_CONFIG.HTTP_STATUS.NOT_FOUND;
  return error;
};

/**
 * Conflict Error (Duplicate or Version Conflict)
 */
const ConflictError = (message, code = ATTENDANCE_CONFIG.ERROR_CODES.DUPLICATE_ATTENDANCE) => {
  const error = new Error(message);
  error.code = code;
  error.status = ATTENDANCE_CONFIG.HTTP_STATUS.CONFLICT;
  return error;
};

/**
 * Unprocessable Entity Error
 */
const UnprocessableEntityError = (message = 'Cannot process this request') => {
  const error = new Error(message);
  error.code = ATTENDANCE_CONFIG.ERROR_CODES.UNPROCESSABLE;
  error.status = ATTENDANCE_CONFIG.HTTP_STATUS.UNPROCESSABLE_ENTITY;
  return error;
};

/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle custom errors
  if (err.code) {
    const response = errorResponse(err.code, err.message, err.details);
    return res.status(err.status || ATTENDANCE_CONFIG.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));

    const response = errorResponse(
      ATTENDANCE_CONFIG.ERROR_CODES.VALIDATION_ERROR,
      'Validation failed',
      details
    );
    return res.status(ATTENDANCE_CONFIG.HTTP_STATUS.BAD_REQUEST).json(response);
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const response = errorResponse(
      ATTENDANCE_CONFIG.ERROR_CODES.DUPLICATE_ATTENDANCE,
      `Duplicate entry for ${field}`
    );
    return res.status(ATTENDANCE_CONFIG.HTTP_STATUS.CONFLICT).json(response);
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    const response = errorResponse(
      ATTENDANCE_CONFIG.ERROR_CODES.VALIDATION_ERROR,
      `Invalid ${err.path}: ${err.value}`
    );
    return res.status(ATTENDANCE_CONFIG.HTTP_STATUS.BAD_REQUEST).json(response);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    const response = errorResponse(
      ATTENDANCE_CONFIG.ERROR_CODES.UNAUTHORIZED,
      'Invalid token'
    );
    return res.status(ATTENDANCE_CONFIG.HTTP_STATUS.UNAUTHORIZED).json(response);
  }

  if (err.name === 'TokenExpiredError') {
    const response = errorResponse(
      ATTENDANCE_CONFIG.ERROR_CODES.UNAUTHORIZED,
      'Token expired'
    );
    return res.status(ATTENDANCE_CONFIG.HTTP_STATUS.UNAUTHORIZED).json(response);
  }

  // Default error
  const response = errorResponse(
    ATTENDANCE_CONFIG.ERROR_CODES.INTERNAL_ERROR,
    'An unexpected error occurred'
  );

  res.status(ATTENDANCE_CONFIG.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res) => {
  const response = errorResponse(
    ATTENDANCE_CONFIG.ERROR_CODES.NOT_FOUND,
    `Route ${req.method} ${req.path} not found`
  );
  res.status(ATTENDANCE_CONFIG.HTTP_STATUS.NOT_FOUND).json(response);
};

module.exports = {
  errorResponse,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  errorHandler,
  notFoundHandler
};
