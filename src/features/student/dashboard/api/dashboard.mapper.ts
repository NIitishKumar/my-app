/**
 * Student Dashboard Mappers
 * Maps API DTOs to domain models
 */

import type {
  DashboardStats,
  AttendanceStats,
  AcademicSummary,
  ScheduleItem,
} from '../data/mockDashboardData';
import type {
  DashboardStatsDTO,
  AttendanceStatsDTO,
  AcademicSummaryDTO,
  ScheduleItemDTO,
} from './dashboard.dto';

export class DashboardMapper {
  static dashboardStatsToDomain(dto: DashboardStatsDTO): DashboardStats {
    return {
      attendancePercentage: dto.attendancePercentage,
      upcomingExamsCount: dto.upcomingExamsCount,
      unreadNotificationsCount: dto.unreadNotificationsCount,
      overallGPA: dto.overallGPA,
      attendanceTrend: dto.attendanceTrend,
    };
  }

  static attendanceStatsToDomain(dto: AttendanceStatsDTO): AttendanceStats {
    return {
      overallPercentage: dto.overallPercentage,
      monthlyData: dto.monthlyData.map((month) => ({
        month: month.month,
        percentage: month.percentage,
        totalDays: month.totalDays,
        presentDays: month.presentDays,
      })),
      recentRecords: dto.recentRecords.map((record) => ({
        date: new Date(record.date),
        status: record.status,
        subject: record.subject,
      })),
      trend: dto.trend,
    };
  }

  static academicSummaryToDomain(dto: AcademicSummaryDTO): AcademicSummary {
    return {
      overallGPA: dto.overallGPA,
      overallPercentage: dto.overallPercentage,
      subjectSummary: dto.subjectSummary.map((subject) => ({
        subject: subject.subject,
        grade: subject.grade,
        percentage: subject.percentage,
        totalMarks: subject.totalMarks,
        obtainedMarks: subject.obtainedMarks,
      })),
      recentGrades: dto.recentGrades.map((grade) => ({
        subject: grade.subject,
        grade: grade.grade,
        percentage: grade.percentage,
        term: grade.term,
        date: new Date(grade.date),
      })),
    };
  }

  static scheduleItemToDomain(dto: ScheduleItemDTO): ScheduleItem {
    return {
      id: dto.id,
      subject: dto.subject,
      teacher: dto.teacher,
      startTime: dto.startTime,
      endTime: dto.endTime,
      room: dto.room,
    };
  }
}

