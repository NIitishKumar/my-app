import mongoose from 'mongoose';

const studentAttendanceSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      required: true,
    },
    remarks: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    records: {
      type: [studentAttendanceSchema],
      default: [],
    },
    marked_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    marked_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// One attendance doc per class per day — this is what makes it a "cycle"
attendanceSchema.index({ class_id: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
