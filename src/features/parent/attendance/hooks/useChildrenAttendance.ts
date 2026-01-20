/**
 * useChildrenAttendance Hook
 */

import { useQuery } from '@tanstack/react-query';
import { parentAttendanceService } from '../api/attendance.service';
import type { ChildrenAttendanceOverview } from '../types/attendance.types';

export const parentAttendanceQueryKeys = {
  all: ['parent-attendance'] as const,
  overview: (filters?: { startDate?: string; endDate?: string }) =>
    [...parentAttendanceQueryKeys.all, 'overview', filters] as const,
  child: (childId: string, filters?: any) =>
    [...parentAttendanceQueryKeys.all, 'child', childId, filters] as const,
  compare: (childIds: string[], filters?: any) =>
    [...parentAttendanceQueryKeys.all, 'compare', childIds, filters] as const,
};

export const useChildrenAttendance = (filters?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery<ChildrenAttendanceOverview>({
    queryKey: parentAttendanceQueryKeys.overview(filters),
    queryFn: () => parentAttendanceService.getChildrenAttendanceOverview(filters),
    staleTime: 5 * 60 * 1000,
  });
};

