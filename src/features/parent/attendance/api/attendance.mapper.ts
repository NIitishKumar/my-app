/**
 * Parent Attendance Mapper
 */

import type {
  ChildAttendanceSummary,
  ChildrenAttendanceOverview,
  ChildAttendanceHistory,
  ChildAttendanceRecord,
  AttendanceComparison,
  ChildAttendanceSummaryApiDTO,
  ChildrenAttendanceOverviewApiResponse,
  ChildAttendanceRecordApiDTO,
  ChildAttendanceHistoryApiResponse,
  AttendanceComparisonApiResponse,
} from '../types/attendance.types';

export const mapChildAttendanceSummaryToDomain = (
  dto: ChildAttendanceSummaryApiDTO
): ChildAttendanceSummary => {
  return {
    childId: dto.childId,
    childName: dto.childName,
    classId: dto.classId,
    className: dto.className,
    summary: dto.summary,
    recentRecords: dto.recentRecords.map((r) => ({
      date: new Date(r.date),
      status: r.status,
      className: r.className,
    })),
  };
};

export const mapChildrenAttendanceOverviewToDomain = (
  response: ChildrenAttendanceOverviewApiResponse
): ChildrenAttendanceOverview => {
  return {
    children: response.data.children.map(mapChildAttendanceSummaryToDomain),
    overallSummary: response.data.overallSummary,
  };
};

export const mapChildAttendanceRecordToDomain = (
  dto: ChildAttendanceRecordApiDTO
): ChildAttendanceRecord => {
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

export const mapChildAttendanceHistoryToDomain = (
  response: ChildAttendanceHistoryApiResponse
): ChildAttendanceHistory => {
  return {
    records: response.data.records.map(mapChildAttendanceRecordToDomain),
    summary: response.data.summary,
    pagination: response.data.pagination,
  };
};

export const mapAttendanceComparisonToDomain = (
  response: AttendanceComparisonApiResponse
): AttendanceComparison => {
  return response.data;
};

