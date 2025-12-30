const { Schema } = require('mongodb');

const teacherSchema = new Schema({
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
    unique: true,
    trim: true,
    lowercase: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  qualification: {
    type: String,
    required: true,
    trim: true
  },
  specialization: [{
    type: String,
    trim: true
  }],
  subjects: [{
    type: String,
    trim: true
  }],
  experience: {
    type: Number, // in years
    min: 0,
    max: 50
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  employmentType: {
    type: String,
    enum: ['permanent', 'contract', 'part-time', 'temporary'],
    default: 'permanent'
  },
  department: {
    type: String,
    trim: true,
    enum: ['Mathematics', 'English', 'Hindi', 'Science', 'Social Studies', 'Computer Science', 'Physical Education', 'Arts', 'Music', 'Administration']
  },
  salary: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active'
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  documents: [{
    name: String,
    type: {
      type: String,
      enum: ['resume', 'certificate', 'degree', 'id-proof', 'address-proof']
    },
    url: String
  }],
  classes: [{
    type: Schema.Types.ObjectId,
    ref: 'classes'
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

// Index for better query performance
teacherSchema.index({ email: 1 });
teacherSchema.index({ employeeId: 1 });
teacherSchema.index({ department: 1 });
teacherSchema.index({ status: 1 });
teacherSchema.index({ firstName: 1, lastName: 1 });

module.exports = teacherSchema;