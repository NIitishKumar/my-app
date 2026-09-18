import { Class } from '../classes/index.js';
import { Student } from '../students/index.js';
import { Teacher } from '../teachers/index.js';
import { Attendance } from './index.js';
import {
    deleteAttendanceRepository,
    findAttendanceByClassAndDate,
    findStudentAttendanceRecords,
    getAttendanceDetailRepository,
    getAttendanceListRepository,
    updateAttendanceRepository,
} from './attendance.repository.js';

// Normalize to midnight so "today" always matches regardless of what time it's called
export function startOfDay(date) {
    const d = date ? new Date(date) : new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

export function endOfDay(date) {
    const d = date ? new Date(date) : new Date();
    d.setHours(23, 59, 59, 999);
    return d;
}

// Step 1-2: open today's attendance — pre-fill from roster if it doesn't exist yet
export async function getOrInitAttendance(classId, date, teacherId) {
    if (!classId) {
        const err = new Error('class_id is required');
        err.status = 400;
        throw err;
    }

    const day = startOfDay(date);
    let attendance = await findAttendanceByClassAndDate(classId, day);
    if (attendance) return attendance;

    const classDoc = await Class.findById(classId);
    if (!classDoc) {
        const err = new Error('Class not found');
        err.status = 404;
        throw err;
    }

    let finalTeacherId = teacherId || classDoc.class_teacher_id;
    if (!finalTeacherId) {
        const err = new Error('marked_by (teacher_id) is required or class must have an assigned class teacher');
        err.status = 400;
        throw err;
    }

    // Get student roster: check student_ids on Class or query Student by class_id
    let studentIds = (classDoc.student_ids && classDoc.student_ids.length > 0)
        ? classDoc.student_ids
        : [];

    if (studentIds.length === 0) {
        const students = await Student.find({ class_id: classId, is_active: true }).select('_id');
        studentIds = students.map((s) => s._id);
    }

    const newAttendance = await Attendance.create({
        class_id: classId,
        date: day,
        marked_by: finalTeacherId,
        records: studentIds.map((studentId) => ({
            student_id: studentId,
            status: 'present', // sensible default; teacher flips absentees
            remarks: null,
        })),
    });

    return await findAttendanceByClassAndDate(classId, day);
}

// Step 3-4: teacher submits/updates the marks for the day
export async function submitAttendance(classId, date, teacherId, records) {
    if (!classId) {
        const err = new Error('class_id is required');
        err.status = 400;
        throw err;
    }
    if (!teacherId) {
        const err = new Error('marked_by (teacher_id) is required');
        err.status = 400;
        throw err;
    }
    if (!Array.isArray(records)) {
        const err = new Error('records must be an array of student attendance items');
        err.status = 400;
        throw err;
    }

    const day = startOfDay(date);

    return await updateAttendanceRepository(
        classId,
        day,
        {
            $set: {
                records,
                marked_by: teacherId,
                marked_at: new Date(),
            },
        }
    );
}

// Step 5a: one student's attendance history / percentage
export async function getStudentAttendance(studentId, fromDate, toDate) {
    if (!studentId) {
        const err = new Error('student_id is required');
        err.status = 400;
        throw err;
    }

    const student = await Student.findById(studentId);
    if (!student) {
        const err = new Error('Student not found');
        err.status = 404;
        throw err;
    }

    // Default to last 30 days if not provided
    const from = fromDate ? startOfDay(fromDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = toDate ? endOfDay(toDate) : endOfDay(new Date());

    const docs = await findStudentAttendanceRecords(studentId, from, to);

    const history = docs.map((doc) => {
        const record = doc.records.find((r) => String(r.student_id) === String(studentId));
        return {
            date: doc.date,
            status: record ? record.status : null,
            remarks: record ? record.remarks : null,
            attendance_id: doc._id,
        };
    }).filter((h) => h.status !== null);

    const presentCount = history.filter((h) => h.status === 'present' || h.status === 'late').length;
    const percentage = history.length ? (presentCount / history.length) * 100 : 0;

    return {
        student: {
            _id: student._id,
            full_name: student.full_name,
            admission_number: student.admission_number,
        },
        date_range: {
            from,
            to,
        },
        total_days: history.length,
        present_days: presentCount,
        percentage: Math.round(percentage * 100) / 100,
        history,
    };
}

export async function getAttendance(filters = {}) {
    try {
        const query = {};
        if (filters.class_id) query.class_id = filters.class_id;
        if (filters.marked_by) query.marked_by = filters.marked_by;
        if (filters.date) {
            query.date = startOfDay(filters.date);
        } else if (filters.fromDate || filters.toDate) {
            query.date = {};
            if (filters.fromDate) query.date.$gte = startOfDay(filters.fromDate);
            if (filters.toDate) query.date.$lte = endOfDay(filters.toDate);
        }

        const attendances = await getAttendanceListRepository(query);
        return attendances || [];
    } catch (error) {
        throw error;
    }
}

export async function getAttendanceDetails(attendanceId) {
    try {
        const attendance = await getAttendanceDetailRepository(attendanceId);
        if (!attendance) {
            const err = new Error('Attendance record not found!');
            err.status = 404;
            throw err;
        }
        return attendance;
    } catch (error) {
        throw error;
    }
}

export async function deleteAttendance(attendanceId) {
    try {
        const attendance = await Attendance.findById(attendanceId);
        if (!attendance) {
            const err = new Error('Attendance record not found!');
            err.status = 404;
            throw err;
        }
        await deleteAttendanceRepository(attendanceId);
        return true;
    } catch (error) {
        throw error;
    }
}
