/**
 * Dashboard React Query Hooks
 */

import { useQuery } from '@tanstack/react-query';
import type { DashboardStatsDTO, QuickStatsDTO } from './api/dashboard.dto';
import { queryKeys } from '../../shared/hooks';
import { dashboardService } from './api/dashboard.service';
// import { dashboardService } from '../api/dashboard.service';
// import { queryKeys } from '../../../../shared/hooks/useApi';
// import type { QuickStats, DashboardStats } from '../types/dashboard.types';

/**
 * Hook to fetch quick dashboard statistics
 */
export const useQuickStats = () => {
  return useQuery<QuickStatsDTO>({
    queryKey: queryKeys.admin.dashboard.quick,
    queryFn: () => dashboardService.getQuickStats(),
  });
};

/**
 * Hook to fetch comprehensive dashboard statistics
 */
export const useDashboardStats = () => {
  return useQuery<DashboardStatsDTO>({
    queryKey: queryKeys.admin.dashboard.stats,
    queryFn: () => dashboardService.getDashboardStats(),
  });
};

