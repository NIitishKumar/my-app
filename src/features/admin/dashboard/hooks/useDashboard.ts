/**
 * Dashboard React Query Hooks
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../api/dashboard.service';
import { queryKeys } from '../../../../shared/hooks/useApi';
import type { QuickStats, DashboardStats } from '../types/dashboard.types';

/**
 * Hook to fetch quick dashboard statistics
 */
export const useQuickStats = () => {
  return useQuery<QuickStats>({
    queryKey: queryKeys.admin.dashboard.quick,
    queryFn: () => dashboardService.getQuickStats(),
  });
};

/**
 * Hook to fetch comprehensive dashboard statistics
 */
export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: queryKeys.admin.dashboard.stats,
    queryFn: () => dashboardService.getDashboardStats(),
  });
};

