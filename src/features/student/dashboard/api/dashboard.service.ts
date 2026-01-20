/**
 * Student Dashboard Service
 * API service for dashboard endpoints
 */

import { httpClient } from '../../../../services/http/httpClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import { DashboardMapper } from './dashboard.mapper';
import type {
  DashboardStats,
  AttendanceStats,
  AcademicSummary,
  ScheduleItem,
} from '../data/mockDashboardData';
import type {
  ApiResponse,
  DashboardStatsDTO,
  AttendanceStatsDTO,
  AcademicSummaryDTO,
  ScheduleItemDTO,
} from './dashboard.dto';

export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await httpClient.get<ApiResponse<DashboardStatsDTO> | DashboardStatsDTO>(
      API_ENDPOINTS.STUDENT_DASHBOARD_STATS
    );
    // Extract data from wrapped response
    const data = (response as ApiResponse<DashboardStatsDTO>).success && (response as ApiResponse<DashboardStatsDTO>).data
      ? (response as ApiResponse<DashboardStatsDTO>).data
      : (response as DashboardStatsDTO);
    return DashboardMapper.dashboardStatsToDomain(data);
  },

  /**
   * Get attendance statistics
   */
  getAttendanceStats: async (): Promise<AttendanceStats> => {
    const response = await httpClient.get<ApiResponse<AttendanceStatsDTO> | AttendanceStatsDTO>(
      API_ENDPOINTS.STUDENT_DASHBOARD_ATTENDANCE
    );
    // Extract data from wrapped response
    const data = (response as ApiResponse<AttendanceStatsDTO>).success && (response as ApiResponse<AttendanceStatsDTO>).data
      ? (response as ApiResponse<AttendanceStatsDTO>).data
      : (response as AttendanceStatsDTO);
    return DashboardMapper.attendanceStatsToDomain(data);
  },

  /**
   * Get academic summary
   */
  getAcademicSummary: async (): Promise<AcademicSummary> => {
    const response = await httpClient.get<ApiResponse<AcademicSummaryDTO> | AcademicSummaryDTO>(
      API_ENDPOINTS.STUDENT_DASHBOARD_ACADEMIC_SUMMARY
    );
    // Extract data from wrapped response
    const data = (response as ApiResponse<AcademicSummaryDTO>).success && (response as ApiResponse<AcademicSummaryDTO>).data
      ? (response as ApiResponse<AcademicSummaryDTO>).data
      : (response as AcademicSummaryDTO);
    return DashboardMapper.academicSummaryToDomain(data);
  },

  /**
   * Get today's schedule
   */
  getTodaysSchedule: async (): Promise<ScheduleItem[]> => {
    const response = await httpClient.get<ApiResponse<ScheduleItemDTO[]> | ScheduleItemDTO[]>(
      API_ENDPOINTS.STUDENT_DASHBOARD_SCHEDULE_TODAY
    );
    // Extract data from wrapped response
    const apiResponse = response as ApiResponse<ScheduleItemDTO[]>;
    const schedule = apiResponse.success && apiResponse.data
      ? apiResponse.data
      : (response as ScheduleItemDTO[]);
    return Array.isArray(schedule) 
      ? schedule.map(DashboardMapper.scheduleItemToDomain)
      : [];
  },
};

