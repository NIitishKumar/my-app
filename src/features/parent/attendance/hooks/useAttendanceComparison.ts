/**
 * useAttendanceComparison Hook
 */

import { useQuery } from '@tanstack/react-query';
import { parentAttendanceService } from '../api/attendance.service';
import { parentAttendanceQueryKeys } from './useChildrenAttendance';
import type { AttendanceComparison } from '../types/attendance.types';

export const useAttendanceComparison = (
  childIds: string[],
  filters?: { startDate?: string; endDate?: string }
) => {
  return useQuery<AttendanceComparison>({
    queryKey: parentAttendanceQueryKeys.compare(childIds, filters),
    queryFn: () => parentAttendanceService.compareChildrenAttendance(childIds, filters),
    staleTime: 10 * 60 * 1000,
    enabled: childIds.length > 0,
  });
};

