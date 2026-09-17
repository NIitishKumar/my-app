import mongoose from 'mongoose';

const guardianSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        relation: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, default: null },
    },
    { _id: false }
);

const studentSchema = new mongoose.Schema(
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
        admission_number: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        date_of_birth: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            required: true,
        },
        class_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            default: null,
        },
        guardian: {
            type: guardianSchema,
            required: true,
        },
        address: { type: String, default: null },
        phone: { type: String, default: null },
        is_active: { type: Boolean, default: true },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Student', studentSchema);