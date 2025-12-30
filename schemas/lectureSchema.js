const { Schema, ObjectId } = require('mongodb');

const lectureSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  teacher: {
    type: ObjectId,
    ref: 'teachers',
    required: true
  },
  classId: {
    type: ObjectId,
    ref: 'classes'
  },
  schedule: {
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    room: {
      type: String,
      trim: true,
      default: ''
    }
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  type: {
    type: String,
    enum: ['lecture', 'lab', 'seminar', 'tutorial'],
    default: 'lecture'
  },
  materials: [{
    name: String,
    type: {
      type: String,
      enum: ['document', 'presentation', 'video', 'link']
    },
    url: String
  }],
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

module.exports = lectureSchema;