/**
 * useAttendanceDashboard Hook
 * Get teacher attendance dashboard data
 */

import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance.api';
import { attendanceQueryKeys } from '../constants/attendance.constants';
import type { DashboardQueryParams } from '../types/attendance.types';

export const useAttendanceDashboard = (params?: DashboardQueryParams) => {
  return useQuery({
    queryKey: attendanceQueryKeys.dashboard(JSON.stringify(params)),
    queryFn: () => attendanceApi.getDashboard(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

