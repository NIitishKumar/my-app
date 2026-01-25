/**
 * Student Exam Service
 * API service for student exam endpoints
 */

import { httpClient } from '../../../../services/http/httpClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import {
  mapExamsResponseToDomain,
  mapExamDetailsToDomain,
  mapExamResultsResponseToDomain,
  mapExamCalendarToDomain,
  mapExamToDomain,
} from './exams.mapper';
import type {
  ExamsResponse,
  ExamDetails,
  ExamResultsResponse,
  ExamCalendar,
  ExamFilters,
  ExamApiDTO,
} from '../types/exam.types';
import type {
  ExamsApiResponse,
  ExamDetailsApiResponse,
  ExamResultsApiResponse,
  ExamCalendarApiResponse,
} from './exams.dto';

/**
 * Build query string from filters
 */
const buildQueryString = (filters?: ExamFilters): string => {
  if (!filters) return '';

  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.subject) params.append('subject', filters.subject);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

export const studentExamService = {
  /**
   * Get student's exam schedule
   */
  getExams: async (filters?: ExamFilters): Promise<ExamsResponse> => {
    const queryString = buildQueryString(filters);
    const endpoint = `${API_ENDPOINTS.STUDENT_EXAMS}${queryString}`;

    const response = await httpClient.get<ExamsApiResponse | ExamsResponse | { exams: ExamApiDTO[] }>(endpoint);

    // Handle wrapped response with success property
    if ('success' in response && response.success) {
      return mapExamsResponseToDomain(response as ExamsApiResponse);
    }

    // Handle direct response with exams array (no wrapper, no pagination)
    if ('exams' in response && Array.isArray(response.exams)) {
      const directResponse = response as { exams: ExamApiDTO[]; pagination?: any };
      const exams = directResponse.exams.map(mapExamToDomain);
      return {
        exams,
        pagination: directResponse.pagination || {
          page: 1,
          limit: exams.length,
          totalPages: 1,
          totalRecords: exams.length,
        },
      };
    }

    // Direct response structure with pagination (already mapped)
    return response as ExamsResponse;
  },

  /**
   * Get detailed information about a specific exam
   */
  getExam: async (id: string): Promise<ExamDetails> => {
    const endpoint = `${API_ENDPOINTS.STUDENT_EXAMS}/${id}`;

    const response = await httpClient.get<ExamDetailsApiResponse | ExamDetails>(endpoint);

    // Handle both wrapped and direct responses
    if ('success' in response && response.success) {
      return mapExamDetailsToDomain(response as ExamDetailsApiResponse);
    }

    // Direct response structure
    return response as ExamDetails;
  },

  /**
   * Get upcoming exams (next 30 days)
   */
  getUpcomingExams: async (limit?: number): Promise<ExamsResponse> => {
    const params = limit ? `?limit=${limit}` : '';
    const endpoint = `${API_ENDPOINTS.STUDENT_EXAMS}/upcoming${params}`;

    const response = await httpClient.get<ExamsApiResponse | ExamsResponse>(endpoint);

    // Handle both wrapped and direct responses
    if ('success' in response && response.success) {
      return mapExamsResponseToDomain(response as ExamsApiResponse);
    }

    return response as ExamsResponse;
  },

  /**
   * Get exam results for completed exams
   */
  getExamResults: async (filters?: {
    subject?: string;
    page?: number;
    limit?: number;
  }): Promise<ExamResultsResponse> => {
    const params = new URLSearchParams();
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const queryString = params.toString();
    const endpoint = `${API_ENDPOINTS.STUDENT_EXAMS}/results${queryString ? `?${queryString}` : ''}`;

    const response = await httpClient.get<ExamResultsApiResponse | ExamResultsResponse>(endpoint);

    // Handle both wrapped and direct responses
    if ('success' in response && response.success) {
      return mapExamResultsResponseToDomain(response as ExamResultsApiResponse);
    }

    return response as ExamResultsResponse;
  },

  /**
   * Get exam calendar for a specific month
   */
  getExamCalendar: async (year: number, month: number): Promise<ExamCalendar> => {
    const params = new URLSearchParams();
    params.append('year', String(year));
    params.append('month', String(month));

    const endpoint = `${API_ENDPOINTS.STUDENT_EXAMS}/calendar?${params.toString()}`;

    const response = await httpClient.get<ExamCalendarApiResponse | ExamCalendar>(endpoint);

    // Handle both wrapped and direct responses
    if ('success' in response && response.success) {
      return mapExamCalendarToDomain(response as ExamCalendarApiResponse);
    }

    return response as ExamCalendar;
  },

  /**
   * Export exam schedule
   */
  exportExamSchedule: async (
    startDate: string,
    endDate: string,
    format: 'excel' | 'csv' | 'pdf'
  ): Promise<Blob> => {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    params.append('format', format);

    const endpoint = `${API_ENDPOINTS.STUDENT_EXAMS}/export?${params.toString()}`;

    // Use apiClient directly for blob responses
    const { apiClient } = await import('../../../../services/api');
    const response = await apiClient.get(endpoint, {
      responseType: 'blob',
      params: Object.fromEntries(params),
    });

    return response.data;
  },
};

