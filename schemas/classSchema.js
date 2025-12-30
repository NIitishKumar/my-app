const { Schema, ObjectId } = require('mongodb');

const classSchema = new Schema({
  className: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  subjects: [{
    type: String,
    required: true,
    trim: true
  }],
  grade: {
    type: String,
    required: true,
    trim: true
  },
  roomNo: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 200
  },
  enrolled: {
    type: Number,
    default: 0,
    min: 0
  },
  students: [{
    type: ObjectId,
    ref: 'students'
  }],
  classHead: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    employeeId: {
      type: String,
      required: true,
      trim: true
    }
  },
  lectures: [{
    type: ObjectId,
    ref: 'lectures'
  }],
  schedule: {
    academicYear: {
      type: String,
      required: true
    },
    semester: {
      type: String,
      enum: ['Fall', 'Spring', 'Summer', 'Winter'],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
classSchema.index({ className: 1 });
classSchema.index({ grade: 1 });
classSchema.index({ 'schedule.academicYear': 1, 'schedule.semester': 1 });

module.exports = classSchema;