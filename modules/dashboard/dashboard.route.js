import {
    getAttendanceTrendsController,
    getDashboardOverviewController,
    getStudentDashboardController,
    getTeacherDashboardController,
} from './index.js';

export default async function dashboardRoutes(fastify, options) {
    // Overall institution dashboard
    fastify.get('/dashboard', getDashboardOverviewController);
    fastify.get('/dashboard/overview', getDashboardOverviewController);

    // Attendance trends & chart data
    fastify.get('/dashboard/trends', getAttendanceTrendsController);

    // Role-specific dashboards
    fastify.get('/dashboard/teacher/:teacherId', getTeacherDashboardController);
    fastify.get('/dashboard/student/:studentId', getStudentDashboardController);
}
