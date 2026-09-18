import {
    getAttendanceTrendsService,
    getDashboardOverviewService,
    getStudentDashboardService,
    getTeacherDashboardService,
} from './index.js';

const getDashboardOverviewController = async (req, res) => {
    try {
        const data = await getDashboardOverviewService(req.query || {});
        return {
            statusCode: 200,
            message: 'Dashboard overview fetched successfully',
            data,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const getAttendanceTrendsController = async (req, res) => {
    try {
        const data = await getAttendanceTrendsService(req.query || {});
        return {
            statusCode: 200,
            message: 'Attendance trends fetched successfully',
            data,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const getTeacherDashboardController = async (req, res) => {
    try {
        const teacherId = req.params.teacherId || req.params.id;
        const data = await getTeacherDashboardService(teacherId, req.query || {});
        return {
            statusCode: 200,
            message: 'Teacher dashboard fetched successfully',
            data,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const getStudentDashboardController = async (req, res) => {
    try {
        const studentId = req.params.studentId || req.params.id;
        const data = await getStudentDashboardService(studentId, req.query || {});
        return {
            statusCode: 200,
            message: 'Student dashboard fetched successfully',
            data,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

export {
    getDashboardOverviewController,
    getAttendanceTrendsController,
    getTeacherDashboardController,
    getStudentDashboardController,
};
