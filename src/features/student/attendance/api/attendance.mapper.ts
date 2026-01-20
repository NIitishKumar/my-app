/**
 * Student Attendance Mapper
 * Transforms between API DTOs and Domain models
 */

import type {
  StudentAttendanceRecord,
  AttendanceSummary,
  AttendanceRecordsResponse,
  AttendanceStatistics,
  CalendarDay,
  AttendanceCalendar,
  StudentAttendanceRecordApiDTO,
  AttendanceSummaryApiDTO,
  AttendanceRecordsApiResponse,
  AttendanceStatisticsApiResponse,
  CalendarDayApiDTO,
  AttendanceCalendarApiResponse,
} from '../types/attendance.types';

/**
 * Map API DTO to Domain model for StudentAttendanceRecord
 */
export const mapStudentAttendanceRecordToDomain = (
  dto: StudentAttendanceRecordApiDTO
): StudentAttendanceRecord => {
  return {
    id: dto.id,
    date: new Date(dto.date),
    classId: dto.classId,
    className: dto.className,
    status: dto.status,
    remarks: dto.remarks,
    submittedBy: dto.submittedBy,
    submittedAt: dto.submittedAt ? new Date(dto.submittedAt) : undefined,
  };
};

/**
 * Map API DTO to Domain model for AttendanceSummary
 */
export const mapAttendanceSummaryToDomain = (
  dto: AttendanceSummaryApiDTO
): AttendanceSummary => {
  return {
    totalDays: dto.totalDays,
    presentDays: dto.presentDays,
    absentDays: dto.absentDays,
    lateDays: dto.lateDays,
    excusedDays: dto.excusedDays,
    attendanceRate: dto.attendanceRate,
  };
};

/**
 * Map API response to AttendanceRecordsResponse
 */
export const mapAttendanceRecordsResponseToDomain = (
  response: AttendanceRecordsApiResponse
): AttendanceRecordsResponse => {
  return {
    records: response.data.records.map(mapStudentAttendanceRecordToDomain),
    summary: mapAttendanceSummaryToDomain(response.data.summary),
    pagination: response.data.pagination,
  };
};

/**
 * Map API response to AttendanceStatistics
 */
export const mapAttendanceStatisticsToDomain = (
  response: AttendanceStatisticsApiResponse
): AttendanceStatistics => {
  return {
    overall: {
      ...mapAttendanceSummaryToDomain(response.data.overall),
      trend: response.data.overall.trend,
    },
    monthlyBreakdown: response.data.monthlyBreakdown,
    classWiseBreakdown: response.data.classWiseBreakdown,
  };
};

/**
 * Map API DTO to Domain model for CalendarDay
 */
export const mapCalendarDayToDomain = (dto: CalendarDayApiDTO): CalendarDay => {
  return {
    date: new Date(dto.date),
    status: dto.status,
    classId: dto.classId,
    className: dto.className,
    remarks: dto.remarks,
  };
};

/**
 * Map API response to AttendanceCalendar
 */
export const mapAttendanceCalendarToDomain = (
  response: AttendanceCalendarApiResponse
): AttendanceCalendar => {
  return {
    year: response.data.year,
    month: response.data.month,
    days: response.data.days.map(mapCalendarDayToDomain),
  };
};

