/**
 * useStudentAttendance Hook
 * Get student's attendance records with filters
 */

import { useQuery } from '@tanstack/react-query';
import { studentAttendanceService } from '../api/attendance.service';
import type { AttendanceFilters, AttendanceRecordsResponse } from '../types/attendance.types';

export const attendanceQueryKeys = {
  all: ['student-attendance'] as const,
  lists: () => [...attendanceQueryKeys.all, 'list'] as const,
  list: (filters?: AttendanceFilters) => [...attendanceQueryKeys.lists(), filters] as const,
  stats: () => [...attendanceQueryKeys.all, 'stats'] as const,
  statsWithParams: (params?: { startDate?: string; endDate?: string; period?: string }) =>
    [...attendanceQueryKeys.stats(), params] as const,
  calendar: () => [...attendanceQueryKeys.all, 'calendar'] as const,
  calendarWithParams: (year: number, month: number, classId?: string) =>
    [...attendanceQueryKeys.calendar(), year, month, classId] as const,
};

export const useStudentAttendance = (filters?: AttendanceFilters) => {
  return useQuery<AttendanceRecordsResponse>({
    queryKey: attendanceQueryKeys.list(filters),
    queryFn: () => studentAttendanceService.getAttendanceRecords(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

