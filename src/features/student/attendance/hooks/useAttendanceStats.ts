/**
 * useAttendanceStats Hook
 * Get student's attendance statistics
 */

import { useQuery } from '@tanstack/react-query';
import { studentAttendanceService } from '../api/attendance.service';
import { attendanceQueryKeys } from './useStudentAttendance';
import type { AttendanceStatistics } from '../types/attendance.types';

export const useAttendanceStats = (params?: {
  startDate?: string;
  endDate?: string;
  period?: string;
}) => {
  return useQuery<AttendanceStatistics>({
    queryKey: attendanceQueryKeys.statsWithParams(params),
    queryFn: () => studentAttendanceService.getAttendanceStats(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

