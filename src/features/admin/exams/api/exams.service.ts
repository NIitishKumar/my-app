/**
 * Admin Exam Service
 */

import { httpClient } from '../../../../services/http/httpClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import {
  mapExamsResponseToDomain,
  mapExamDetailsToDomain,
  mapCreateExamToDTO,
  mapBulkCreateResultToDomain,
  mapExamDashboardToDomain,
  mapExamAnalyticsToDomain,
  mapExamConflictsToDomain,
} from './exams.mapper';
import type {
  ExamsResponse,
  ExamDetails,
  CreateExamData,
  BulkCreateExamData,
  BulkCreateResult,
  ExamDashboard,
  ExamAnalytics,
  ExamConflict,
} from '../types/exam.types';
import type {
  ExamsApiResponse,
  ExamDetailsApiResponse,
  CreateExamApiDTO,
  BulkCreateResultApiResponse,
  ExamDashboardApiResponse,
  ExamAnalyticsApiResponse,
  ExamConflictsApiResponse,
} from './exams.dto';

const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

export const adminExamService = {
  /**
   * Get exam dashboard
   */
  getDashboard: async (filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ExamDashboard> => {
    const queryString = filters ? `?${buildQueryString(filters)}` : '';
    const endpoint = `${API_ENDPOINTS.ADMIN_EXAMS}/dashboard${queryString}`;

    const response = await httpClient.get<ExamDashboardApiResponse | ExamDashboard>(endpoint);

    if ('success' in response && response.success) {
      return mapExamDashboardToDomain(response as ExamDashboardApiResponse);
    }

    return response as ExamDashboard;
  },

  /**
   * Get all exams (school-wide)
   */
  getExams: async (filters?: {
    classId?: string;
    subject?: string;
    teacherId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ExamsResponse> => {
    const queryString = filters ? `?${buildQueryString(filters)}` : '';
    const endpoint = `${API_ENDPOINTS.ADMIN_EXAMS}${queryString}`;

    const response = await httpClient.get<ExamsApiResponse | ExamsResponse>(endpoint);

    if ('success' in response && response.success) {
      return mapExamsResponseToDomain(response as ExamsApiResponse);
    }

    return response as ExamsResponse;
  },

  /**
   * Get detailed exam information
   */
  getExam: async (id: string): Promise<ExamDetails> => {
    const endpoint = `${API_ENDPOINTS.ADMIN_EXAMS}/${id}`;

    const response = await httpClient.get<ExamDetailsApiResponse | ExamDetails>(endpoint);

    if ('success' in response && response.success) {
      return mapExamDetailsToDomain(response as ExamDetailsApiResponse);
    }

    return response as ExamDetails;
  },

  /**
   * Create a new exam
   */
  createExam: async (data: CreateExamData): Promise<ExamDetails> => {
    const dto = mapCreateExamToDTO(data);
    const endpoint = API_ENDPOINTS.ADMIN_EXAMS;

    const response = await httpClient.post<ExamDetailsApiResponse | ExamDetails>(endpoint, dto);

    if ('success' in response && response.success) {
      return mapExamDetailsToDomain(response as ExamDetailsApiResponse);
    }

    return response as ExamDetails;
  },

  /**
   * Update an exam
   */
  updateExam: async (id: string, data: Partial<CreateExamData>): Promise<ExamDetails> => {
    const dto = mapCreateExamToDTO(data as CreateExamData);
    const endpoint = `${API_ENDPOINTS.ADMIN_EXAMS}/${id}`;

    const response = await httpClient.put<ExamDetailsApiResponse | ExamDetails>(endpoint, dto);

    if ('success' in response && response.success) {
      return mapExamDetailsToDomain(response as ExamDetailsApiResponse);
    }

    return response as ExamDetails;
  },

  /**
   * Delete an exam
   */
  deleteExam: async (id: string): Promise<void> => {
    const endpoint = `${API_ENDPOINTS.ADMIN_EXAMS}/${id}`;
    await httpClient.delete(endpoint);
  },

  /**
   * Bulk create exams
   */
  bulkCreateExams: async (data: BulkCreateExamData): Promise<BulkCreateResult> => {
    const endpoint = `${API_ENDPOINTS.ADMIN_EXAMS}/bulk`;
    const dto = {
      exams: data.exams.map(mapCreateExamToDTO),
    };

    const response = await httpClient.post<BulkCreateResultApiResponse | BulkCreateResult>(
      endpoint,
      dto
    );

    if ('success' in response && response.success) {
      return mapBulkCreateResultToDomain(response as BulkCreateResultApiResponse);
    }

    return response as BulkCreateResult;
  },

  /**
   * Import exams from file
   */
  importExams: async (file: File): Promise<BulkCreateResult> => {
    const endpoint = `${API_ENDPOINTS.ADMIN_EXAMS}/import`;
    const formData = new FormData();
    formData.append('file', file);

    const response = await httpClient.post<BulkCreateResultApiResponse | BulkCreateResult>(
      endpoint,
      formData
    );

    if ('success' in response && response.success) {
      return mapBulkCreateResultToDomain(response as BulkCreateResultApiResponse);
    }

    return response as BulkCreateResult;
  },

  /**
   * Export exam schedules
   */
  exportExams: async (
    startDate: string,
    endDate: string,
    format: 'excel' | 'csv' | 'pdf',
    filters?: {
      classId?: string;
      subject?: string;
    }
  ): Promise<Blob> => {
    const params: Record<string, unknown> = { startDate, endDate, format, ...filters };
    const queryString = buildQueryString(params);
    const endpoint = `${API_ENDPOINTS.ADMIN_EXAMS}/export?${queryString}`;

    const { apiClient } = await import('../../../../services/api');
    const response = await apiClient.get(endpoint, {
      responseType: 'blob',
      params: Object.fromEntries(new URLSearchParams(queryString)),
    });

    return response.data;
  },

  /**
   * Get exam analytics
   */
  getAnalytics: async (filters?: {
    startDate?: string;
    endDate?: string;
    classId?: string;
    subject?: string;
  }): Promise<ExamAnalytics> => {
    const queryString = filters ? `?${buildQueryString(filters)}` : '';
    const endpoint = `${API_ENDPOINTS.ADMIN_EXAMS}/analytics${queryString}`;

    const response = await httpClient.get<ExamAnalyticsApiResponse | ExamAnalytics>(endpoint);

    if ('success' in response && response.success) {
      return mapExamAnalyticsToDomain(response as ExamAnalyticsApiResponse);
    }

    return response as ExamAnalytics;
  },

  /**
   * Check for exam conflicts
   */
  getConflicts: async (filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ExamConflict[]> => {
    const queryString = filters ? `?${buildQueryString(filters)}` : '';
    const endpoint = `${API_ENDPOINTS.ADMIN_EXAMS}/conflicts${queryString}`;

    const response = await httpClient.get<ExamConflictsApiResponse | { conflicts: ExamConflict[] }>(
      endpoint
    );

    if ('success' in response && response.success) {
      return mapExamConflictsToDomain(response as ExamConflictsApiResponse);
    }

    return (response as { conflicts: ExamConflict[] }).conflicts;
  },
};

