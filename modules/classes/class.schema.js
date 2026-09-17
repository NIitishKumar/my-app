import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        section: {
            type: String,
            required: true,
            trim: true,
        },
        class_teacher_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
            default: null,
        },
        subjects: {
            type: [String],
            default: [],
        },
        room_number: {
            type: String,
            default: null,
        },
        student_ids: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student',
            },
        ],
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// One "Grade 5 - A" per school, not per name alone
classSchema.index({ name: 1, section: 1 }, { unique: true });

export default mongoose.model('Class', classSchema);