/**
 * Parent Attendance Service
 */

import { httpClient } from '../../../../services/http/httpClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import {
  mapChildrenAttendanceOverviewToDomain,
  mapChildAttendanceHistoryToDomain,
  mapAttendanceComparisonToDomain,
} from './attendance.mapper';
import type {
  ChildrenAttendanceOverview,
  ChildAttendanceHistory,
  AttendanceComparison,
} from '../types/attendance.types';
import type {
  ChildrenAttendanceOverviewApiResponse,
  ChildAttendanceHistoryApiResponse,
  AttendanceComparisonApiResponse,
} from './attendance.dto';

const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

export const parentAttendanceService = {
  /**
   * Get attendance overview for all children
   */
  getChildrenAttendanceOverview: async (
    filters?: { startDate?: string; endDate?: string }
  ): Promise<ChildrenAttendanceOverview> => {
    const queryString = filters ? `?${buildQueryString(filters)}` : '';
    const endpoint = `${API_ENDPOINTS.PARENT_ATTENDANCE}/overview${queryString}`;
    
    const response = await httpClient.get<
      ChildrenAttendanceOverviewApiResponse | ChildrenAttendanceOverview
    >(endpoint);
    
    if ('success' in response && response.success) {
      return mapChildrenAttendanceOverviewToDomain(response as ChildrenAttendanceOverviewApiResponse);
    }
    
    return response as ChildrenAttendanceOverview;
  },

  /**
   * Get attendance for a specific child
   */
  getChildAttendance: async (
    childId: string,
    filters?: { startDate?: string; endDate?: string; page?: number; limit?: number }
  ): Promise<ChildAttendanceHistory> => {
    const queryString = filters ? `?${buildQueryString(filters)}` : '';
    const endpoint = `${API_ENDPOINTS.PARENT_ATTENDANCE}/${childId}${queryString}`;
    
    const response = await httpClient.get<
      ChildAttendanceHistoryApiResponse | ChildAttendanceHistory
    >(endpoint);
    
    if ('success' in response && response.success) {
      return mapChildAttendanceHistoryToDomain(response as ChildAttendanceHistoryApiResponse);
    }
    
    return response as ChildAttendanceHistory;
  },

  /**
   * Compare attendance across children
   */
  compareChildrenAttendance: async (
    childIds: string[],
    filters?: { startDate?: string; endDate?: string }
  ): Promise<AttendanceComparison> => {
    const params: Record<string, unknown> = { childIds };
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    
    const queryString = buildQueryString(params);
    const endpoint = `${API_ENDPOINTS.PARENT_ATTENDANCE}/compare?${queryString}`;
    
    const response = await httpClient.get<
      AttendanceComparisonApiResponse | AttendanceComparison
    >(endpoint);
    
    if ('success' in response && response.success) {
      return mapAttendanceComparisonToDomain(response as AttendanceComparisonApiResponse);
    }
    
    return response as AttendanceComparison;
  },
};

