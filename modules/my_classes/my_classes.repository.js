import { Class } from '../classes/index.js';
import { Lecture } from '../lectures/index.js';
import { Teacher } from '../teachers/index.js';
import { Student } from '../students/index.js';
import { Attendance } from '../attendance/index.js';

/**
 * TEACHER: Get all classes where the teacher is the class_teacher
 * and all classes where they have at least one lecture assigned.
 */
export const getTeacherClassesRepository = async (teacherId) => {
    try {
        // Classes where this teacher is the assigned class teacher
        const primaryClasses = await Class.find({ class_teacher_id: teacherId })
            .populate('student_ids', 'full_name admission_number gender phone is_active')
            .populate('class_teacher_id', 'full_name employee_id subjects phone')
            .lean();

        // Classes where teacher has at least one lecture
        const lectureClassIds = await Lecture.distinct('class_id', { teacher_id: teacherId });

        const lectureClasses = await Class.find({
            _id: { $in: lectureClassIds, $nin: primaryClasses.map((c) => c._id) },
        })
            .populate('student_ids', 'full_name admission_number gender phone is_active')
            .populate('class_teacher_id', 'full_name employee_id subjects phone')
            .lean();

        return { primary_classes: primaryClasses, lecture_classes: lectureClasses };
    } catch (error) {
        throw error;
    }
};

/**
 * TEACHER: Get detailed view of a single class with lectures taught by this teacher.
 */
export const getTeacherClassDetailRepository = async (teacherId, classId) => {
    try {
        const classDoc = await Class.findById(classId)
            .populate('student_ids', 'full_name admission_number gender phone is_active')
            .populate('class_teacher_id', 'full_name employee_id subjects phone')
            .lean();

        if (!classDoc) return null;

        // Lectures this teacher handles in this class
        const myLectures = await Lecture.find({ teacher_id: teacherId, class_id: classId })
            .sort({ day_of_week: 1, start_time: 1 })
            .lean();

        // All lectures for this class
        const allLectures = await Lecture.find({ class_id: classId })
            .populate('teacher_id', 'full_name employee_id subjects')
            .sort({ day_of_week: 1, start_time: 1 })
            .lean();

        return { ...classDoc, my_lectures: myLectures, all_lectures: allLectures };
    } catch (error) {
        throw error;
    }
};

/**
 * TEACHER: Recent attendance records submitted by this teacher.
 */
export const getTeacherRecentAttendanceRepository = async (teacherId, limit = 10) => {
    try {
        return await Attendance.find({ marked_by: teacherId })
            .populate('class_id', 'name section room_number')
            .sort({ marked_at: -1 })
            .limit(limit)
            .lean();
    } catch (error) {
        throw error;
    }
};

/**
 * STUDENT: Get the class details for this student's enrolled class.
 */
export const getStudentClassRepository = async (studentId) => {
    try {
        const student = await Student.findById(studentId)
            .populate({
                path: 'class_id',
                populate: {
                    path: 'class_teacher_id',
                    select: 'full_name employee_id subjects qualification phone',
                },
            })
            .lean();

        if (!student || !student.class_id) return null;

        return student.class_id;
    } catch (error) {
        throw error;
    }
};

/**
 * STUDENT: Get full timetable for the student's class.
 */
export const getStudentTimetableRepository = async (classId) => {
    try {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const lectures = await Lecture.find({ class_id: classId })
            .populate('teacher_id', 'full_name employee_id subjects phone')
            .sort({ day_of_week: 1, start_time: 1 })
            .lean();

        // Group by day for easier frontend consumption
        const timetable = {};
        days.forEach((day) => {
            timetable[day] = lectures.filter((l) => l.day_of_week === day);
        });

        return { lectures, timetable };
    } catch (error) {
        throw error;
    }
};

/**
 * STUDENT: Get classmates list.
 */
export const getStudentClassmatesRepository = async (classId, excludeStudentId) => {
    try {
        return await Student.find({
            class_id: classId,
            _id: { $ne: excludeStudentId },
            is_active: true,
        })
            .select('full_name admission_number gender phone')
            .sort({ full_name: 1 })
            .lean();
    } catch (error) {
        throw error;
    }
};
