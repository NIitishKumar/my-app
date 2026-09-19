import { Teacher } from '../teachers/index.js';
import { Student } from '../students/index.js';
import {
    getStudentClassmatesRepository,
    getStudentClassRepository,
    getStudentTimetableRepository,
    getTeacherClassDetailRepository,
    getTeacherClassesRepository,
    getTeacherRecentAttendanceRepository,
} from './my_classes.repository.js';

// ─── TEACHER ────────────────────────────────────────────────────────────────

/**
 * Returns all classes the teacher is responsible for:
 * - Classes where they are the class teacher (primary classes)
 * - Classes where they deliver at least one lecture
 */
export async function getMyClassesForTeacher(teacherId) {
    const teacher = await Teacher.findOne({ user_id: teacherId }).lean();
    if (!teacher) {
        const err = new Error('Teacher not found');
        err.status = 404;
        throw err;
    }

    const { primary_classes, lecture_classes } = await getTeacherClassesRepository(teacher._id);

    return {
        teacher: {
            _id: teacher._id,
            full_name: teacher.full_name,
            employee_id: teacher.employee_id,
            subjects: teacher.subjects,
        },
        summary: {
            primary_class_count: primary_classes.length,
            lecture_class_count: lecture_classes.length,
            total_classes: primary_classes.length + lecture_classes.length,
        },
        primary_classes, // classes where teacher is the class teacher
        lecture_classes, // classes where teacher only takes lectures
    };
}

/**
 * Returns detailed information for a single class from the teacher's perspective:
 * - Class details and student roster
 * - This teacher's lectures in the class
 * - Full class timetable (all teachers)
 * - Recent attendance submitted by this teacher for this class
 */
export async function getMyClassDetailForTeacher(teacherId, classId) {
    const teacher = await Teacher.findOne({ user_id: teacherId }).lean();
    if (!teacher) {
        const err = new Error('Teacher not found');
        err.status = 404;
        throw err;
    }

    const classDetail = await getTeacherClassDetailRepository(teacher._id, classId);
    if (!classDetail) {
        const err = new Error('Class not found');
        err.status = 404;
        throw err;
    }

    const recentAttendance = await getTeacherRecentAttendanceRepository(teacherId, 5);

    return {
        teacher: {
            _id: teacher._id,
            full_name: teacher.full_name,
            employee_id: teacher.employee_id,
        },
        class: classDetail,
        recent_attendance: recentAttendance,
    };
}

// ─── STUDENT ────────────────────────────────────────────────────────────────

/**
 * Returns the student's enrolled class with:
 * - Class info and class teacher details
 * - Full timetable grouped by day
 * - Classmates list
 */
export async function getMyClassForStudent(studentId) {
    const student = await Student.findById(studentId)
        .select('full_name admission_number gender class_id is_active phone')
        .lean();

    if (!student) {
        const err = new Error('Student not found');
        err.status = 404;
        throw err;
    }

    if (!student.class_id) {
        return {
            student: {
                _id: student._id,
                full_name: student.full_name,
                admission_number: student.admission_number,
            },
            enrolled: false,
            class: null,
            timetable: null,
            classmates: [],
        };
    }

    const [classDoc, timetableData, classmates] = await Promise.all([
        getStudentClassRepository(studentId),
        getStudentTimetableRepository(student.class_id),
        getStudentClassmatesRepository(student.class_id, studentId),
    ]);

    return {
        student: {
            _id: student._id,
            full_name: student.full_name,
            admission_number: student.admission_number,
            gender: student.gender,
            phone: student.phone,
        },
        enrolled: true,
        class: classDoc,
        timetable: timetableData.timetable,
        lectures: timetableData.lectures,
        classmates_count: classmates.length,
        classmates,
    };
}

/**
 * Returns only the timetable for the student's class.
 */
export async function getMyTimetableForStudent(studentId) {
    const student = await Student.findById(studentId).select('full_name class_id').lean();
    if (!student) {
        const err = new Error('Student not found');
        err.status = 404;
        throw err;
    }

    if (!student.class_id) {
        const err = new Error('Student is not enrolled in any class');
        err.status = 400;
        throw err;
    }

    const { lectures, timetable } = await getStudentTimetableRepository(student.class_id);

    return {
        student_name: student.full_name,
        class_id: student.class_id,
        timetable,
        lectures,
    };
}
