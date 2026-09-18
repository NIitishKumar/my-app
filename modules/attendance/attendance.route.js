import {
    deleteAttendanceController,
    getAttendanceController,
    getAttendanceDetailsController,
    getOrInitAttendanceController,
    getStudentAttendanceController,
    submitAttendanceController,
} from './index.js';

export default async function attendanceRoutes(fastify, options) {
    // Open/initialize attendance for today
    fastify.post('/attendance/init', getOrInitAttendanceController);
    fastify.get('/attendance/init', getOrInitAttendanceController);

    // Submit or update daily attendance marks
    fastify.post('/attendance/submit', submitAttendanceController);
    fastify.post('/attendance', submitAttendanceController);

    // Student attendance history & percentage
    fastify.get('/attendance/student/:studentId', getStudentAttendanceController);

    // General attendance list and detail
    fastify.get('/attendance', getAttendanceController);
    fastify.get('/attendance/:id', getAttendanceDetailsController);
    fastify.delete('/attendance/:id', deleteAttendanceController);
}
