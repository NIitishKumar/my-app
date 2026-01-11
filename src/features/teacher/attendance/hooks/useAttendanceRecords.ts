/**
 * useAttendanceRecords Hook
 * Get paginated attendance records with filters
 */

import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance.api';
import { attendanceQueryKeys } from '../constants/attendance.constants';
import type { AttendanceFilters } from '../types/attendance.types';

export const useAttendanceRecords = (filters?: AttendanceFilters) => {
  return useQuery({
    queryKey: attendanceQueryKeys.list(JSON.stringify(filters)),
    queryFn: () => attendanceApi.getRecords(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: true, // Always enabled, filters can be empty
  });
};

