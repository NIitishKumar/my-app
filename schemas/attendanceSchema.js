const { getDatabase, ObjectId } = require('../db');

// Enhanced Attendance Schema with locking, versioning, and audit trails
const createAttendanceSchema = () => {
  const schemaDefinition = {
    classId: {
      type: ObjectId,
      required: true
    },
    className: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    lectureId: {
      type: ObjectId
    },
    lectureTitle: {
      type: String
    },
    type: {
      type: String,
      enum: ['date', 'lecture'],
      default: 'date'
    },
    students: [{
      studentId: {
        type: ObjectId,
        required: true
      },
      studentName: {
        type: String,
        required: true
      },
      studentIdNumber: {
        type: String
      },
      status: {
        type: String,
        enum: ['present', 'absent', 'late', 'excused'],
        required: true
      },
      remarks: {
        type: String,
        default: null
      },
      markedAt: {
        type: Date,
        default: Date.now
      },
      markedBy: {
        type: ObjectId
      }
    }],
    submittedBy: {
      type: ObjectId,
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    lockedAt: {
      type: Date
    },
    lockedBy: {
      type: ObjectId
    },
    version: {
      type: Number,
      default: 1
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  };

  return schemaDefinition;
};

// Create indexes for performance
const createAttendanceIndexes = async (db) => {
  const collection = db.collection('attendance');

  await collection.createIndex({ classId: 1, date: 1 }, { unique: true });
  await collection.createIndex({ classId: 1, lectureId: 1, date: -1 });
  await collection.createIndex({ date: -1 });
  await collection.createIndex({ submittedBy: 1, date: -1 });
  await collection.createIndex({ 'students.studentId': 1, date: -1 });
  await collection.createIndex({ lectureId: 1 });
  await collection.createIndex({ isLocked: 1 });
  await collection.createIndex({ createdAt: -1 });

  console.log('✅ Attendance indexes created successfully');
};

// Helper function to validate attendance status
const isValidStatus = (status) => {
  return ['present', 'absent', 'late', 'excused'].includes(status);
};

// Helper function to validate date format (YYYY-MM-DD)
const isValidDateFormat = (dateString) => {
  if (!dateString) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Helper function to check if date is in the future
const isFutureDate = (dateString) => {
  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return inputDate > today;
};

// Helper function to check if date is too old for updates (30 days)
const isTooOldForUpdate = (dateString, daysThreshold = 30) => {
  const inputDate = new Date(dateString);
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - daysThreshold);
  threshold.setHours(23, 59, 59, 999);
  return inputDate < threshold;
};

// Helper function to check if date is too old for deletion (7 days)
const isTooOldForDeletion = (dateString, daysThreshold = 7) => {
  const inputDate = new Date(dateString);
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - daysThreshold);
  threshold.setHours(23, 59, 59, 999);
  return inputDate < threshold;
};

module.exports = {
  createAttendanceSchema,
  createAttendanceIndexes,
  isValidStatus,
  isValidDateFormat,
  isFutureDate,
  isTooOldForUpdate,
  isTooOldForDeletion
};
