import {
    getMyClassDetailForTeacherService,
    getMyClassesForTeacherService,
    getMyClassForStudentService,
    getMyTimetableForStudentService,
} from './index.js';

// ─── TEACHER CONTROLLERS ─────────────────────────────────────────────────────

const getMyClassesForTeacherController = async (req, res) => {
    try {
        const teacherId = req.params.teacherId;
        const data = await getMyClassesForTeacherService(teacherId);
        return {
            statusCode: 200,
            message: 'Teacher classes fetched successfully',
            data,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const getMyClassDetailForTeacherController = async (req, res) => {
    try {
        const { teacherId, classId } = req.params;
        const data = await getMyClassDetailForTeacherService(teacherId, classId);
        return {
            statusCode: 200,
            message: 'Teacher class detail fetched successfully',
            data,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

// ─── STUDENT CONTROLLERS ─────────────────────────────────────────────────────

const getMyClassForStudentController = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const data = await getMyClassForStudentService(studentId);
        return {
            statusCode: 200,
            message: 'Student class fetched successfully',
            data,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const getMyTimetableForStudentController = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const data = await getMyTimetableForStudentService(studentId);
        return {
            statusCode: 200,
            message: 'Student timetable fetched successfully',
            data,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

export {
    getMyClassesForTeacherController,
    getMyClassDetailForTeacherController,
    getMyClassForStudentController,
    getMyTimetableForStudentController,
};
