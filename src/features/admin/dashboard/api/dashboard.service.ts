/**
 * Dashboard API Service
 */

import { httpClient } from '../../../../services/http/httpClient';
import { dashboardEndpoints } from './dashboard.endpoints';
import { DashboardMapper } from './dashboard.mapper';
import type {
  QuickStatsDTO,
  DashboardStatsDTO,
  ApiResponse,
} from './dashboard.dto';
import type {
  QuickStats,
  DashboardStats,
} from '../types/dashboard.types';

export const dashboardService = {
  /**
   * Get quick dashboard statistics
   */
  getQuickStats: async (): Promise<QuickStats> => {
    try {
      const response = await httpClient.get<ApiResponse<QuickStatsDTO>>(
        dashboardEndpoints.quick()
      );
      
      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }
      
      return DashboardMapper.quickStatsToDomain(response.data);
    } catch (error) {
      console.error('Error fetching quick stats:', error);
      throw error;
    }
  },

  /**
   * Get comprehensive dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await httpClient.get<ApiResponse<DashboardStatsDTO>>(
        dashboardEndpoints.stats()
      );
      
      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }
      
      return DashboardMapper.dashboardStatsToDomain(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};

