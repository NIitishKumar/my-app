/**
 * Timetable Service
 * API service for timetable endpoints
 */

import { httpClient } from '../../../../services/http/httpClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import { TimetableMapper } from './timetable.mapper';
import type { WeeklyTimetable } from '../models/timetable.model';
import type {
  ApiResponse,
  WeeklyTimetableDTO,
} from './timetable.dto';

export const timetableService = {
  /**
   * Get weekly timetable
   * @param weekStartDate - Optional date to get timetable for a specific week (defaults to current week)
   */
  getWeeklyTimetable: async (weekStartDate?: Date): Promise<WeeklyTimetable> => {
    const params: Record<string, string> = {};
    if (weekStartDate) {
      params.weekStart = weekStartDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    const response = await httpClient.get<ApiResponse<WeeklyTimetableDTO> | WeeklyTimetableDTO>(
      API_ENDPOINTS.STUDENT_TIMETABLE_WEEK,
      params
    );

    // Extract data from wrapped response or use direct response
    // Check if response has the wrapper structure
    let data: WeeklyTimetableDTO;
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
      const apiResponse = response as ApiResponse<WeeklyTimetableDTO>;
      if (apiResponse.success && apiResponse.data) {
        data = apiResponse.data;
      } else {
        throw new Error('Invalid API response: success is false or data is missing');
      }
    } else {
      // Direct response (no wrapper)
      data = response as WeeklyTimetableDTO;
    }

    return TimetableMapper.weeklyTimetableToDomain(data);
  },

  /**
   * Get timetable for a specific day
   * @param date - Date to get timetable for
   */
  getDayTimetable: async (date: Date): Promise<WeeklyTimetable> => {
    const params = {
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
    };

    const response = await httpClient.get<ApiResponse<WeeklyTimetableDTO> | WeeklyTimetableDTO>(
      API_ENDPOINTS.STUDENT_TIMETABLE_DAY,
      params
    );

    // Extract data from wrapped response or use direct response
    let data: WeeklyTimetableDTO;
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
      const apiResponse = response as ApiResponse<WeeklyTimetableDTO>;
      if (apiResponse.success && apiResponse.data) {
        data = apiResponse.data;
      } else {
        throw new Error('Invalid API response: success is false or data is missing');
      }
    } else {
      data = response as WeeklyTimetableDTO;
    }

    return TimetableMapper.weeklyTimetableToDomain(data);
  },

  /**
   * Get timetable for a date range
   * @param startDate - Start date
   * @param endDate - End date
   */
  getTimetableByRange: async (startDate: Date, endDate: Date): Promise<WeeklyTimetable> => {
    const params = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    const response = await httpClient.get<ApiResponse<WeeklyTimetableDTO> | WeeklyTimetableDTO>(
      API_ENDPOINTS.STUDENT_TIMETABLE,
      params
    );

    // Extract data from wrapped response or use direct response
    let data: WeeklyTimetableDTO;
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
      const apiResponse = response as ApiResponse<WeeklyTimetableDTO>;
      if (apiResponse.success && apiResponse.data) {
        data = apiResponse.data;
      } else {
        throw new Error('Invalid API response: success is false or data is missing');
      }
    } else {
      data = response as WeeklyTimetableDTO;
    }

    return TimetableMapper.weeklyTimetableToDomain(data);
  },
};

