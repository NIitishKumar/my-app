import {
    deleteAttendanceService,
    getAttendanceDetailsService,
    getAttendanceService,
    getOrInitAttendanceService,
    getStudentAttendanceService,
    submitAttendanceService,
} from './index.js';

const getOrInitAttendanceController = async (req, res) => {
    try {
        const payload = req.body || req.query || {};
        const classId = payload.class_id || payload.classId;
        const date = payload.date;
        const teacherId = payload.marked_by || payload.teacher_id || payload.teacherId;

        const attendance = await getOrInitAttendanceService(classId, date, teacherId);
        return {
            statusCode: 200,
            message: 'Attendance initialized/fetched successfully',
            data: attendance,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const submitAttendanceController = async (req, res) => {
    try {
        const payload = req.body || {};
        const classId = payload.class_id || payload.classId;
        const date = payload.date;
        const teacherId = payload.marked_by || payload.teacher_id || payload.teacherId;
        const records = payload.records;

        const attendance = await submitAttendanceService(classId, date, teacherId, records);
        return {
            statusCode: 200,
            message: 'Attendance submitted successfully',
            data: attendance,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const getStudentAttendanceController = async (req, res) => {
    try {
        const studentId = req.params.studentId || req.params.id;
        const { fromDate, toDate } = req.query || {};

        const data = await getStudentAttendanceService(studentId, fromDate, toDate);
        return {
            statusCode: 200,
            message: 'Student attendance fetched successfully',
            data,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const getAttendanceController = async (req, res) => {
    try {
        const attendances = await getAttendanceService(req.query || {});
        return {
            statusCode: 200,
            message: 'Attendance records fetched successfully',
            data: attendances,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const getAttendanceDetailsController = async (req, res) => {
    try {
        const { id } = req.params;
        const attendance = await getAttendanceDetailsService(id);
        return {
            statusCode: 200,
            message: 'Attendance details fetched successfully',
            data: attendance,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const deleteAttendanceController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteAttendanceService(id);
        return {
            statusCode: 200,
            message: 'Attendance record deleted successfully',
            data: result,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

export {
    getOrInitAttendanceController,
    submitAttendanceController,
    getStudentAttendanceController,
    getAttendanceController,
    getAttendanceDetailsController,
    deleteAttendanceController,
};
