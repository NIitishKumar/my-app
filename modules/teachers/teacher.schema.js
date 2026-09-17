import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    full_name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true,
    },
    employee_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    subjects: {
      type: [String],
      default: [],
    },
    date_of_joining: {
      type: Date,
      required: true,
    },
    qualification: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Teacher', teacherSchema);
