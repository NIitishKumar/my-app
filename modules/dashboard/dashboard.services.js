import {
    getCountsSummaryRepository,
    getRecentActivitiesRepository,
    getStudentDashboardDataRepository,
    getTeacherDashboardDataRepository,
    getTodayAttendanceSummaryRepository,
    getTodayLecturesRepository,
    getWeeklyAttendanceTrendRepository,
} from './dashboard.repository.js';
import { Teacher } from '../teachers/index.js';
import { Student } from '../students/index.js';

export function getDayOfWeekName(date) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const d = date ? new Date(date) : new Date();
    return days[d.getDay()];
}

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

export async function getDashboardOverview(query = {}) {
    try {
        const targetDate = query.date ? new Date(query.date) : new Date();
        const startDay = startOfDay(targetDate);
        const endDay = endOfDay(targetDate);
        const dayOfWeek = getDayOfWeekName(targetDate);

        // Role-based delegation if specific role ID provided
        if (query.teacher_id) {
            return await getTeacherDashboard(query.teacher_id, query);
        }
        if (query.student_id) {
            return await getStudentDashboard(query.student_id, query);
        }

        const [counts, attendanceToday, todayLectures, recent] = await Promise.all([
            getCountsSummaryRepository(),
            getTodayAttendanceSummaryRepository(startDay, endDay),
            getTodayLecturesRepository(dayOfWeek),
            getRecentActivitiesRepository(),
        ]);

        return {
            date: startDay,
            day_of_week: dayOfWeek,
            counts,
            attendance_today: attendanceToday,
            today_lectures: todayLectures,
            recent_activities: recent,
        };
    } catch (error) {
        throw error;
    }
}

export async function getAttendanceTrends(query = {}) {
    try {
        const toDate = query.toDate ? endOfDay(query.toDate) : endOfDay(new Date());
        const fromDate = query.fromDate
            ? startOfDay(query.fromDate)
            : startOfDay(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

        const trends = await getWeeklyAttendanceTrendRepository(fromDate, toDate);
        return {
            from_date: fromDate,
            to_date: toDate,
            trends,
        };
    } catch (error) {
        throw error;
    }
}

export async function getTeacherDashboard(teacherId, query = {}) {
    try {
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            const err = new Error('Teacher not found');
            err.status = 404;
            throw err;
        }

        const targetDate = query.date ? new Date(query.date) : new Date();
        const startDay = startOfDay(targetDate);
        const endDay = endOfDay(targetDate);
        const dayOfWeek = getDayOfWeekName(targetDate);

        const data = await getTeacherDashboardDataRepository(teacherId, dayOfWeek, startDay, endDay);

        return {
            teacher: {
                _id: teacher._id,
                full_name: teacher.full_name,
                employee_id: teacher.employee_id,
                subjects: teacher.subjects,
                qualification: teacher.qualification,
                phone: teacher.phone,
            },
            date: startDay,
            day_of_week: dayOfWeek,
            ...data,
        };
    } catch (error) {
        throw error;
    }
}

export async function getStudentDashboard(studentId, query = {}) {
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            const err = new Error('Student not found');
            err.status = 404;
            throw err;
        }

        const targetDate = query.date ? new Date(query.date) : new Date();
        const fromDate = query.fromDate
            ? startOfDay(query.fromDate)
            : startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        const toDate = query.toDate ? endOfDay(query.toDate) : endOfDay(targetDate);
        const dayOfWeek = getDayOfWeekName(targetDate);

        const data = await getStudentDashboardDataRepository(studentId, dayOfWeek, fromDate, toDate);

        return {
            date: startOfDay(targetDate),
            day_of_week: dayOfWeek,
            ...data,
        };
    } catch (error) {
        throw error;
    }
}
