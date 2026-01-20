/**
 * Student Attendance Service
 * API service for student attendance endpoints
 */

import { httpClient } from '../../../../services/http/httpClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import {
  mapAttendanceRecordsResponseToDomain,
  mapAttendanceStatisticsToDomain,
  mapAttendanceCalendarToDomain,
} from './attendance.mapper';
import type {
  AttendanceRecordsResponse,
  AttendanceStatistics,
  AttendanceCalendar,
  AttendanceFilters,
} from '../types/attendance.types';
import type {
  AttendanceRecordsApiResponse,
  AttendanceStatisticsApiResponse,
  AttendanceCalendarApiResponse,
} from './attendance.dto';

/**
 * Build query string from filters
 */
const buildQueryString = (filters?: AttendanceFilters): string => {
  if (!filters) return '';
  
  const params = new URLSearchParams();
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.classId) params.append('classId', filters.classId);
  if (filters.status) params.append('status', filters.status);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

export const studentAttendanceService = {
  /**
   * Get student's attendance records
   */
  getAttendanceRecords: async (
    filters?: AttendanceFilters
  ): Promise<AttendanceRecordsResponse> => {
    const queryString = buildQueryString(filters);
    const endpoint = `${API_ENDPOINTS.STUDENT_ATTENDANCE}${queryString}`;
    
    const response = await httpClient.get<AttendanceRecordsApiResponse | AttendanceRecordsResponse>(
      endpoint
    );
    
    // Handle both wrapped and direct responses
    if ('success' in response && response.success) {
      return mapAttendanceRecordsResponseToDomain(response as AttendanceRecordsApiResponse);
    }
    
    // Direct response structure
    return response as AttendanceRecordsResponse;
  },

  /**
   * Get student's attendance statistics
   */
  getAttendanceStats: async (
    filters?: { startDate?: string; endDate?: string; period?: string }
  ): Promise<AttendanceStatistics> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.period) params.append('period', filters.period);
    
    const queryString = params.toString();
    const endpoint = `${API_ENDPOINTS.STUDENT_ATTENDANCE}/stats${queryString ? `?${queryString}` : ''}`;
    
    const response = await httpClient.get<AttendanceStatisticsApiResponse | AttendanceStatistics>(
      endpoint
    );
    
    // Handle both wrapped and direct responses
    if ('success' in response && response.success) {
      return mapAttendanceStatisticsToDomain(response as AttendanceStatisticsApiResponse);
    }
    
    // Direct response structure
    return response as AttendanceStatistics;
  },

  /**
   * Get attendance calendar for a specific month
   */
  getAttendanceCalendar: async (
    year: number,
    month: number,
    classId?: string
  ): Promise<AttendanceCalendar> => {
    const params = new URLSearchParams();
    params.append('year', String(year));
    params.append('month', String(month));
    if (classId) params.append('classId', classId);
    
    const endpoint = `${API_ENDPOINTS.STUDENT_ATTENDANCE}/calendar?${params.toString()}`;
    
    const response = await httpClient.get<AttendanceCalendarApiResponse | AttendanceCalendar>(
      endpoint
    );
    
    // Handle both wrapped and direct responses
    if ('success' in response && response.success) {
      return mapAttendanceCalendarToDomain(response as AttendanceCalendarApiResponse);
    }
    
    // Direct response structure
    return response as AttendanceCalendar;
  },

  /**
   * Export attendance report
   */
  exportAttendance: async (
    startDate: string,
    endDate: string,
    format: 'excel' | 'csv' | 'pdf',
    classId?: string
  ): Promise<Blob> => {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    params.append('format', format);
    if (classId) params.append('classId', classId);
    
    const endpoint = `${API_ENDPOINTS.STUDENT_ATTENDANCE}/export?${params.toString()}`;
    
    // Use apiClient directly for blob responses
    const { apiClient } = await import('../../../../services/api');
    const response = await apiClient.get(endpoint, {
      responseType: 'blob',
      params: Object.fromEntries(params),
    });
    
    return response.data;
  },
};

