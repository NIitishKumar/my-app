/**
 * useChildAttendance Hook
 */

import { useQuery } from '@tanstack/react-query';
import { parentAttendanceService } from '../api/attendance.service';
import { parentAttendanceQueryKeys } from './useChildrenAttendance';
import type { ChildAttendanceHistory } from '../types/attendance.types';

export const useChildAttendance = (
  childId: string,
  filters?: { startDate?: string; endDate?: string; page?: number; limit?: number }
) => {
  return useQuery<ChildAttendanceHistory>({
    queryKey: parentAttendanceQueryKeys.child(childId, filters),
    queryFn: () => parentAttendanceService.getChildAttendance(childId, filters),
    staleTime: 5 * 60 * 1000,
    enabled: !!childId,
  });
};

