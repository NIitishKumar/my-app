/**
 * Attendance Configuration Constants
 */

const ATTENDANCE_CONFIG = {
  // Time restrictions
  UPDATE_MAX_DAYS_OLD: 30, // Cannot update records older than 30 days
  DELETE_MAX_DAYS_OLD: 7,  // Teachers cannot delete records older than 7 days
  DELETE_TEACHER_HOURS: 24, // Teachers can only delete within 24 hours of submission

  // Validation limits
  MAX_STUDENTS_PER_RECORD: 200,
  MAX_REMARKS_LENGTH: 500,

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,

  // Statistics
  TREND_COMPARISON_DAYS: 7, // Compare last 7 days vs previous 7 days
  TREND_THRESHOLD_PERCENT: 2, // 2% change threshold for trend determination

  // Academic year
  ACADEMIC_YEAR_START_MONTH: 8, // September (0-indexed: 8)
  ACADEMIC_YEAR_START_DAY: 1,

  // Error codes
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    DUPLICATE_ATTENDANCE: 'DUPLICATE_ATTENDANCE',
    VERSION_CONFLICT: 'VERSION_CONFLICT',
    UNPROCESSABLE: 'UNPROCESSABLE',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DELETE_RESTRICTED: 'DELETE_RESTRICTED'
  },

  // HTTP status codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
  },

  // Attendance statuses
  STATUSES: {
    PRESENT: 'present',
    ABSENT: 'absent',
    LATE: 'late',
    EXCUSED: 'excused'
  },

  // Attendance types
  TYPES: {
    DATE: 'date',
    LECTURE: 'lecture'
  },

  // User roles
  ROLES: {
    TEACHER: 'TEACHER',
    ADMIN: 'ADMIN',
    STUDENT: 'STUDENT',
    PARENT: 'PARENT'
  }
};

module.exports = ATTENDANCE_CONFIG;
