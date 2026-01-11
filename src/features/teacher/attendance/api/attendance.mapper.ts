/**
 * Teacher Attendance Mapper
 * Transforms between API DTOs and Domain models
 */

import type {
  AttendanceRecord,
  AttendanceDashboardData,
  AttendanceStatistics,
  StudentAttendanceHistory,
  MarkAttendanceData,
  UpdateAttendanceData,
  RecentActivityItem,
  UpcomingClassItem,
  StudentAttendanceStatistics,
  DailyBreakdownItem,
  StudentAttendanceRecord,
  AttendanceRecordsResponse,
  StudentAttendance,
  AttendanceRecordApiDTO,
  AttendanceDashboardApiResponse,
  AttendanceStatisticsApiResponse,
  StudentAttendanceHistoryApiResponse,
  AttendanceRecordsApiResponse,
  MarkAttendanceRequestDTO,
  UpdateAttendanceRequestDTO,
  StudentAttendanceApiDTO,
} from '../types/attendance.types';

/**
 * Map API DTO to Domain model for StudentAttendance
 */
export const mapStudentAttendanceApiToDomain = (
  dto: StudentAttendanceApiDTO
): StudentAttendance => {
  return {
    studentId: dto.studentId,
    studentName: dto.studentName,
    studentIdNumber: dto.studentIdNumber,
    status: dto.status,
    remarks: dto.remarks,
    markedAt: dto.markedAt ? new Date(dto.markedAt) : undefined,
    markedBy: dto.markedBy,
  };
};

/**
 * Map API DTO to Domain model for AttendanceRecord
 */
export const mapAttendanceRecordApiToDomain = (
  dto: AttendanceRecordApiDTO
): AttendanceRecord => {
  // Ensure students is always an array
  const students = (dto.students && Array.isArray(dto.students))
    ? dto.students.map(mapStudentAttendanceApiToDomain)
    : [];

  return {
    id: dto._id,
    classId: dto.classId,
    className: dto.className,
    date: new Date(dto.date),
    lectureId: dto.lectureId,
    lectureTitle: dto.lectureTitle,
    type: dto.type,
    students,
    submittedBy: dto.submittedBy,
    submittedAt: dto.submittedAt ? new Date(dto.submittedAt) : undefined,
    isLocked: dto.isLocked ?? false,
    lockedAt: dto.lockedAt ? new Date(dto.lockedAt) : undefined,
    lockedBy: dto.lockedBy,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    version: dto.version,
  };
};

/**
 * Map API response to AttendanceRecordsResponse
 */
export const mapAttendanceRecordsApiResponse = (
  response: AttendanceRecordsApiResponse
): AttendanceRecordsResponse => {
  return {
    success: response.success,
    count: response.count,
    page: response.page,
    totalPages: response.totalPages,
    data: response.data.map(mapAttendanceRecordApiToDomain),
  };
};

/**
 * Map API response to AttendanceDashboardData
 */
export const mapAttendanceDashboardApiResponse = (
  response: AttendanceDashboardApiResponse
): AttendanceDashboardData => {
  return {
    totalClasses: response.data.totalClasses,
    pendingAttendance: response.data.pendingAttendance,
    todayAttendance: response.data.todayAttendance,
    recentActivity: response.data.recentActivity.map((item): RecentActivityItem => ({
      classId: item.classId,
      className: item.className,
      date: item.date,
      studentsCount: item.studentsCount,
      markedAt: item.markedAt,
    })),
    upcomingClasses: response.data.upcomingClasses.map((item): UpcomingClassItem => ({
      classId: item.classId,
      className: item.className,
      scheduledTime: item.scheduledTime,
      hasAttendance: item.hasAttendance,
    })),
  };
};

/**
 * Map API response to AttendanceStatistics
 */
export const mapAttendanceStatisticsApiResponse = (
  response: AttendanceStatisticsApiResponse
): AttendanceStatistics => {
  return {
    classId: response.data.classId,
    className: response.data.className,
    period: {
      startDate: response.data.period.startDate,
      endDate: response.data.period.endDate,
    },
    overall: {
      totalDays: response.data.overall.totalDays,
      presentDays: response.data.overall.presentDays,
      absentDays: response.data.overall.absentDays,
      lateDays: response.data.overall.lateDays,
      excusedDays: response.data.overall.excusedDays,
      attendanceRate: response.data.overall.attendanceRate,
    },
    studentStats: response.data.studentStats.map((stat): StudentAttendanceStatistics => ({
      studentId: stat.studentId,
      studentName: stat.studentName,
      totalDays: stat.totalDays,
      presentDays: stat.presentDays,
      absentDays: stat.absentDays,
      lateDays: stat.lateDays,
      excusedDays: stat.excusedDays,
      attendanceRate: stat.attendanceRate,
      trend: stat.trend,
    })),
    dailyBreakdown: response.data.dailyBreakdown.map((item): DailyBreakdownItem => ({
      date: item.date,
      present: item.present,
      absent: item.absent,
      late: item.late,
      excused: item.excused,
    })),
  };
};

/**
 * Map API response to StudentAttendanceHistory
 */
export const mapStudentAttendanceHistoryApiResponse = (
  response: StudentAttendanceHistoryApiResponse
): StudentAttendanceHistory => {
  return {
    studentId: response.data.studentId,
    studentName: response.data.studentName,
    records: response.data.records.map((record): StudentAttendanceRecord => ({
      date: record.date,
      classId: record.classId,
      className: record.className,
      status: record.status,
      remarks: record.remarks,
      submittedBy: record.submittedBy,
      submittedAt: record.submittedAt,
    })),
    summary: {
      totalDays: response.data.summary.totalDays,
      presentDays: response.data.summary.presentDays,
      absentDays: response.data.summary.absentDays,
      lateDays: response.data.summary.lateDays,
      excusedDays: response.data.summary.excusedDays,
      attendanceRate: response.data.summary.attendanceRate,
    },
  };
};

/**
 * Map Domain model to API DTO for MarkAttendanceRequest
 */
export const mapMarkAttendanceToDTO = (
  data: MarkAttendanceData
): MarkAttendanceRequestDTO => {
  const dto: MarkAttendanceRequestDTO = {
    date: data.date,
    students: data.students.map((student) => {
      const studentDto: { studentId: string; status: string; remarks?: string } = {
        studentId: student.studentId,
        status: student.status,
      };
      // Only include remarks if it exists and is not empty
      if (student.remarks && student.remarks.trim() !== '') {
        studentDto.remarks = student.remarks.trim();
      }
      return studentDto;
    }),
  };
  
  // Only include lectureId if it exists
  if (data.lectureId && data.lectureId.trim() !== '') {
    dto.lectureId = data.lectureId.trim();
  }
  
  return dto;
};

/**
 * Map Domain model to API DTO for UpdateAttendanceRequest
 */
export const mapUpdateAttendanceToDTO = (
  data: UpdateAttendanceData
): UpdateAttendanceRequestDTO => {
  const dto: UpdateAttendanceRequestDTO = {};
  
  if (data.date !== undefined) {
    dto.date = data.date;
  }
  
  if (data.lectureId !== undefined) {
    dto.lectureId = data.lectureId;
  }
  
  if (data.students !== undefined) {
    dto.students = data.students.map((student) => {
      const studentDto: { studentId: string; status: string; remarks?: string } = {
        studentId: student.studentId,
        status: student.status,
      };
      // Only include remarks if it exists and is not empty
      if (student.remarks && student.remarks.trim() !== '') {
        studentDto.remarks = student.remarks.trim();
      }
      return studentDto;
    });
  }
  
  return dto;
};

