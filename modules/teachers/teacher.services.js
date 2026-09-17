import mongoose from 'mongoose';
import { findUserByEmailRepo, User } from '../users/index.js';
import { Class } from '../classes/index.js';
import { Teacher } from './index.js';
import bcrypt from 'bcrypt';

export async function getTeachers() {
    try {
        const teachers = await Teacher.find({})
            .populate('user_id', 'name email role isActive')
            .sort({ created_at: -1 });
        return teachers || [];
    } catch (error) {
        throw error;
    }
}

export async function getTeacherDetails(teacherId) {
    try {
        const teacher = await Teacher.findById(teacherId)
            .populate('user_id', 'name email role isActive');
        if (!teacher) {
            const err = new Error('Teacher not found!');
            err.status = 404;
            throw err;
        }
        return teacher;
    } catch (error) {
        throw error;
    }
}

export async function createTeacher(payload) {
    const {
        full_name,
        email,
        password,
        user_id,
        employee_id,
        date_of_joining,
        subjects = [],
        qualification = null,
        phone = null,
        is_active = true,
        ...otherDetails
    } = payload;

    if (!full_name) {
        const err = new Error('full_name is required');
        err.status = 400;
        throw err;
    }

    if (!employee_id) {
        const err = new Error('employee_id is required');
        err.status = 400;
        throw err;
    }

    if (!date_of_joining) {
        const err = new Error('date_of_joining is required');
        err.status = 400;
        throw err;
    }

    const existingEmployee = await Teacher.findOne({ employee_id });
    if (existingEmployee) {
        const err = new Error(`Teacher with employee_id '${employee_id}' already exists`);
        err.status = 400;
        throw err;
    }

    let finalUserId = user_id;

    if (email) {
        const existingUser = await findUserByEmailRepo({ email });
        if (existingUser) {
            if (!user_id || existingUser._id.toString() !== user_id.toString()) {
                const err = new Error('User with this email already exists');
                err.status = 400;
                throw err;
            }
        }
    }

    const session = await mongoose.startSession();
    let createdTeacher;

    try {
        await session.withTransaction(async () => {
            if (!finalUserId) {
                if (!email || !password) {
                    const err = new Error('Either user_id or (email and password) must be provided to create a teacher');
                    err.status = 400;
                    throw err;
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const [newUser] = await User.create(
                    [{ name: full_name, email, password: hashedPassword, role: 'teacher', isActive: is_active }],
                    { session }
                );
                finalUserId = newUser._id;
            }

            const [teacher] = await Teacher.create(
                [{
                    full_name,
                    employee_id,
                    date_of_joining,
                    subjects,
                    qualification,
                    phone,
                    is_active,
                    user_id: finalUserId,
                    ...otherDetails,
                }],
                { session }
            );

            createdTeacher = teacher;
            return teacher;
        });

        return createdTeacher;
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        // Fallback if transactions are not supported (e.g. standalone MongoDB without replica set)
        if (error.message && error.message.includes('replica set')) {
            if (!finalUserId) {
                if (!email || !password) {
                    const err = new Error('Either user_id or (email and password) must be provided to create a teacher');
                    err.status = 400;
                    throw err;
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await User.create({
                    name: full_name,
                    email,
                    password: hashedPassword,
                    role: 'teacher',
                    isActive: is_active
                });
                finalUserId = newUser._id;
            }

            const teacher = await Teacher.create({
                full_name,
                employee_id,
                date_of_joining,
                subjects,
                qualification,
                phone,
                is_active,
                user_id: finalUserId,
                ...otherDetails,
            });
            return teacher;
        }
        throw error;
    } finally {
        session.endSession();
    }
}

export async function updateTeacher(teacherId, payload) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
        const err = new Error('Teacher not found!');
        err.status = 404;
        throw err;
    }

    if (payload.employee_id && payload.employee_id !== teacher.employee_id) {
        const existing = await Teacher.findOne({ employee_id: payload.employee_id });
        if (existing) {
            const err = new Error(`Teacher with employee_id '${payload.employee_id}' already exists`);
            err.status = 400;
            throw err;
        }
    }

    const allowedFields = [
        'full_name',
        'employee_id',
        'subjects',
        'date_of_joining',
        'qualification',
        'phone',
        'is_active',
    ];

    allowedFields.forEach((field) => {
        if (payload[field] !== undefined) {
            teacher[field] = payload[field];
        }
    });

    await teacher.save();

    if (payload.full_name && teacher.user_id) {
        await User.updateOne({ _id: teacher.user_id }, { name: payload.full_name });
    }

    return teacher;
}

export async function deleteTeacher(teacherId) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
        const err = new Error('Teacher not found!');
        err.status = 404;
        throw err;
    }

    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            await Class.updateMany(
                { class_teacher_id: teacher._id },
                { $set: { class_teacher_id: null } },
                { session }
            );
            await Teacher.deleteOne({ _id: teacher._id }, { session });
            if (teacher.user_id) {
                await User.deleteOne({ _id: teacher.user_id }, { session });
            }
        });
        return true;
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        if (error.message && error.message.includes('replica set')) {
            await Class.updateMany(
                { class_teacher_id: teacher._id },
                { $set: { class_teacher_id: null } }
            );
            await Teacher.deleteOne({ _id: teacher._id });
            if (teacher.user_id) {
                await User.deleteOne({ _id: teacher.user_id });
            }
            return true;
        }
        throw error;
    } finally {
        session.endSession();
    }
}
