import { Student } from '../students/index.js';
import { Teacher } from '../teachers/index.js';
import { Class } from '../classes/index.js';
import { Lecture } from '../lectures/index.js';
import { Attendance } from '../attendance/index.js';

export const getCountsSummaryRepository = async () => {
    try {
        const [
            totalStudents,
            activeStudents,
            totalTeachers,
            activeTeachers,
            totalClasses,
            totalLectures,
        ] = await Promise.all([
            Student.countDocuments(),
            Student.countDocuments({ is_active: true }),
            Teacher.countDocuments(),
            Teacher.countDocuments({ is_active: true }),
            Class.countDocuments(),
            Lecture.countDocuments(),
        ]);

        return {
            students: {
                total: totalStudents,
                active: activeStudents,
                inactive: totalStudents - activeStudents,
            },
            teachers: {
                total: totalTeachers,
                active: activeTeachers,
                inactive: totalTeachers - activeTeachers,
            },
            classes: {
                total: totalClasses,
            },
            lectures: {
                total: totalLectures,
            },
        };
    } catch (error) {
        throw error;
    }
};

export const getTodayAttendanceSummaryRepository = async (startDate, endDate) => {
    try {
        const docs = await Attendance.find({
            date: { $gte: startDate, $lte: endDate },
        }).populate('class_id', 'name section');

        let totalRecords = 0;
        let presentCount = 0;
        let absentCount = 0;
        let lateCount = 0;
        let excusedCount = 0;

        docs.forEach((doc) => {
            if (Array.isArray(doc.records)) {
                doc.records.forEach((rec) => {
                    totalRecords++;
                    if (rec.status === 'present') presentCount++;
                    else if (rec.status === 'absent') absentCount++;
                    else if (rec.status === 'late') lateCount++;
                    else if (rec.status === 'excused') excusedCount++;
                });
            }
        });

        const attended = presentCount + lateCount;
        const percentage = totalRecords > 0 ? (attended / totalRecords) * 100 : 0;

        return {
            classes_marked: docs.length,
            total_students_marked: totalRecords,
            present: presentCount,
            absent: absentCount,
            late: lateCount,
            excused: excusedCount,
            percentage: Math.round(percentage * 100) / 100,
            classes: docs.map((d) => ({
                attendance_id: d._id,
                class_id: d.class_id?._id,
                class_name: d.class_id ? `${d.class_id.name} - ${d.class_id.section}` : null,
                marked_at: d.marked_at,
                total_students: d.records ? d.records.length : 0,
            })),
        };
    } catch (error) {
        throw error;
    }
};

export const getTodayLecturesRepository = async (dayOfWeek) => {
    try {
        return await Lecture.find({ day_of_week: dayOfWeek })
            .populate('class_id', 'name section room_number')
            .populate('teacher_id', 'full_name employee_id subjects qualification phone')
            .sort({ start_time: 1 });
    } catch (error) {
        throw error;
    }
};

export const getRecentActivitiesRepository = async () => {
    try {
        const [recentStudents, recentTeachers, recentAttendances] = await Promise.all([
            Student.find()
                .sort({ created_at: -1 })
                .limit(5)
                .select('full_name admission_number class_id created_at')
                .populate('class_id', 'name section'),
            Teacher.find()
                .sort({ created_at: -1 })
                .limit(5)
                .select('full_name employee_id subjects qualification created_at'),
            Attendance.find()
                .sort({ marked_at: -1 })
                .limit(5)
                .populate('class_id', 'name section')
                .populate('marked_by', 'full_name employee_id'),
        ]);

        return {
            recent_students: recentStudents,
            recent_teachers: recentTeachers,
            recent_attendances: recentAttendances,
        };
    } catch (error) {
        throw error;
    }
};

export const getWeeklyAttendanceTrendRepository = async (startDate, endDate) => {
    try {
        const docs = await Attendance.find({
            date: { $gte: startDate, $lte: endDate },
        }).sort({ date: 1 });

        // Group by day (YYYY-MM-DD)
        const dayMap = {};
        docs.forEach((doc) => {
            const dayKey = new Date(doc.date).toISOString().split('T')[0];
            if (!dayMap[dayKey]) {
                dayMap[dayKey] = { date: dayKey, present: 0, late: 0, absent: 0, total: 0 };
            }
            if (Array.isArray(doc.records)) {
                doc.records.forEach((r) => {
                    dayMap[dayKey].total++;
                    if (r.status === 'present') dayMap[dayKey].present++;
                    else if (r.status === 'late') dayMap[dayKey].late++;
                    else if (r.status === 'absent') dayMap[dayKey].absent++;
                });
            }
        });

        return Object.values(dayMap).map((d) => {
            const attended = d.present + d.late;
            const percentage = d.total > 0 ? (attended / d.total) * 100 : 0;
            return {
                date: d.date,
                total: d.total,
                present: d.present,
                absent: d.absent,
                late: d.late,
                percentage: Math.round(percentage * 100) / 100,
            };
        });
    } catch (error) {
        throw error;
    }
};

export const getTeacherDashboardDataRepository = async (teacherId, dayOfWeek, startDay, endDay) => {
    try {
        const [assignedClasses, todayLectures, totalLecturesCount, todayAttendance] = await Promise.all([
            Class.find({ class_teacher_id: teacherId }),
            Lecture.find({ teacher_id: teacherId, day_of_week: dayOfWeek })
                .populate('class_id', 'name section room_number')
                .sort({ start_time: 1 }),
            Lecture.countDocuments({ teacher_id: teacherId }),
            Attendance.find({
                marked_by: teacherId,
                date: { $gte: startDay, $lte: endDay },
            }).populate('class_id', 'name section'),
        ]);

        return {
            assigned_classes: assignedClasses,
            today_lectures: todayLectures,
            total_lectures_count: totalLecturesCount,
            today_marked_attendance: todayAttendance,
        };
    } catch (error) {
        throw error;
    }
};

export const getStudentDashboardDataRepository = async (studentId, dayOfWeek, fromDate, toDate) => {
    try {
        const student = await Student.findById(studentId)
            .populate({
                path: 'class_id',
                populate: { path: 'class_teacher_id', select: 'full_name employee_id phone' },
            });

        if (!student) {
            const err = new Error('Student not found');
            err.status = 404;
            throw err;
        }

        let todayLectures = [];
        if (student.class_id?._id) {
            todayLectures = await Lecture.find({
                class_id: student.class_id._id,
                day_of_week: dayOfWeek,
            })
                .populate('teacher_id', 'full_name employee_id subjects phone')
                .sort({ start_time: 1 });
        }

        // Student's attendance in date range
        const attendanceDocs = await Attendance.find({
            date: { $gte: fromDate, $lte: toDate },
            'records.student_id': studentId,
        }).sort({ date: -1 });

        let presentDays = 0;
        const history = attendanceDocs.map((doc) => {
            const rec = doc.records.find((r) => String(r.student_id) === String(studentId));
            if (rec && (rec.status === 'present' || rec.status === 'late')) {
                presentDays++;
            }
            return {
                date: doc.date,
                status: rec ? rec.status : null,
                remarks: rec ? rec.remarks : null,
            };
        });

        const totalDays = history.length;
        const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

        return {
            student: {
                _id: student._id,
                full_name: student.full_name,
                admission_number: student.admission_number,
                gender: student.gender,
                phone: student.phone,
                class: student.class_id,
            },
            today_lectures: todayLectures,
            attendance: {
                total_days: totalDays,
                present_days: presentDays,
                percentage: Math.round(percentage * 100) / 100,
                recent_history: history.slice(0, 10),
            },
        };
    } catch (error) {
        throw error;
    }
};
