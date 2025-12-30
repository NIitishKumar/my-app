const { Schema, ObjectId } = require('mongodb');

const attendanceSchema = new Schema({
  classId: {
    type: ObjectId,
    ref: 'classes',
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
    type: ObjectId,
    ref: 'lectures'
  },
  lectureTitle: {
    type: String
  },
  students: [{
    studentId: {
      type: ObjectId,
      ref: 'students',
      required: true
    },
    studentName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      required: true
    },
    remarks: {
      type: String,
      default: null
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

// Indexes for performance
attendanceSchema.index({ classId: 1, date: -1 });
attendanceSchema.index({ classId: 1, lectureId: 1, date: -1 });
attendanceSchema.index({ date: -1 });

module.exports = attendanceSchema;
