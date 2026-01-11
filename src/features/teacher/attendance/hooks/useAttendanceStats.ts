/**
 * useAttendanceStats Hook
 * Get class attendance statistics
 */

import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance.api';
import { attendanceQueryKeys } from '../constants/attendance.constants';
import type { StatisticsQueryParams } from '../types/attendance.types';

export const useAttendanceStats = (
  classId: string,
  params?: StatisticsQueryParams
) => {
  return useQuery({
    queryKey: attendanceQueryKeys.stats(classId, JSON.stringify(params)),
    queryFn: () => attendanceApi.getStatistics(classId, params),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000, // 5 minutes (stats don't change frequently)
  });
};

