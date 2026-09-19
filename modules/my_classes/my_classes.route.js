import {
    getMyClassDetailForTeacherController,
    getMyClassesForTeacherController,
    getMyClassForStudentController,
    getMyTimetableForStudentController,
} from './index.js';

export default async function myClassesRoutes(fastify, options) {
    // ── Teacher endpoints ──────────────────────────────────────────────────
    // All classes and lectures assigned to a teacher
    fastify.get('/my-classes/teacher/:teacherId', getMyClassesForTeacherController);

    // Detailed view of one class for a teacher (students, lectures, recent attendance)
    fastify.get('/my-classes/teacher/:teacherId/class/:classId', getMyClassDetailForTeacherController);

    // ── Student endpoints ──────────────────────────────────────────────────
    // Student's enrolled class + timetable + classmates
    fastify.get('/my-classes/student/:studentId', getMyClassForStudentController);

    // Student's weekly timetable only
    fastify.get('/my-classes/student/:studentId/timetable', getMyTimetableForStudentController);
}
