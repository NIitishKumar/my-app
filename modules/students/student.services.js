import mongoose from 'mongoose';
import { findUserByEmailRepo, User } from '../users/index.js';
import { Class } from '../classes/index.js';
import { Student } from './index.js';
import bcrypt from 'bcrypt';


export async function createStudent(payload) {

    const { full_name, email, class_id, password, ...studentDetails } = payload;

    const existingUser = await findUserByEmailRepo({ email });
    if (existingUser) {
        const err = new Error('User already exists');
        err.status = 400;
        throw err;
    }
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {


            const hashedPassword = await bcrypt.hash(password, 10);
            const [user] = await User.create([{ name: full_name, email, password: hashedPassword, role: 'student' }], { session });
            const [student] = await Student.create([{ ...studentDetails, full_name, email, class_id, user_id: user._id }], { session });
            if (class_id) {
                await Class.updateOne({ _id: class_id }, {
                    $addToSet: { student_ids: student._id }
                }, { session })
            }
            return student;
        })
    } catch (error) {
        console.log({ error })
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw error
    } finally {
        session.endSession();
    }
};

export async function updateStudentClass(studentId, newClassId) {
    const student = await Student.findById({ _id: studentId });

    if (!student) {
        const err = new Error('Student not found!');
        err.status = 404;
        return err;
    }

    if (student.class_id === newClassId) {
        return student;
    }

    const session = await mongoose.startSession();

    session.startTransaction(async () => {
        try {

            if (student.class_id) {
                await Class.updateOne({ _id: student.class_id }, {
                    $pull: { student_ids: studentId }
                },
                    { session }
                )
            };

            if (newClassId) {
                await Class.updateOne({ _id: newClassId }, {
                    $addToSet: { student_ids: studentId }
                }, { session })
            }

            student.class_id = newClassId;
            await student.save({ session });
            return student;
        } catch (error) {
            throw error
        } finally {
            session.endSession();
        }
    })
}


// --- Delete: removes from class roster, deletes profile, deletes login ---
async function deleteStudent(studentId) {
    const student = await Student.findById(studentId);
    if (!student) return false;

    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            if (student.class_id) {
                await Class.updateOne(
                    { _id: student.class_id },
                    { $pull: { student_ids: student._id } },
                    { session }
                );
            }
            await Student.deleteOne({ _id: studentId }, { session });
            await User.deleteOne({ _id: student.user_id }, { session });
        });
        return true;
    } finally {
        session.endSession();
    }
}