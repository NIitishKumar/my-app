import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    day_of_week: {
      type: String,
      required: true,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    },
    start_time: {
      type: String, // "09:00" — 24hr "HH:mm", keeps it timezone-agnostic and easy to compare
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'start_time must be HH:mm'],
    },
    end_time: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'end_time must be HH:mm'],
    },
    room_number: {
      type: String,
      default: null,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// Prevent double-booking: same class can't have two lectures at the same day+time
lectureSchema.index({ class_id: 1, day_of_week: 1, start_time: 1 }, { unique: true });

export default mongoose.model('Lecture', lectureSchema);
