/**
 * Teacher Exam Service
 */

import { httpClient } from '../../../../services/http/httpClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import {
  mapExamsResponseToDomain,
  mapExamDetailsToDomain,
  mapExamCalendarToDomain,
  mapExamEnrollmentToDomain,
} from './exams.mapper';
import { mapCreateExamToDTO } from '../../../admin/exams/api/exams.mapper';
import type {
  ExamsResponse,
  ExamDetails,
  ExamCalendar,
} from '../../../student/exams/types/exam.types';
import type {
  ExamEnrollment,
} from '../types/exam.types';
import type {
  ExamsApiResponse,
  ExamDetailsApiResponse,
  ExamCalendarApiResponse,
} from '../../../student/exams/types/exam.types';
import type {
  ExamEnrollmentApiResponse,
} from './exams.dto';
import type { CreateExamData } from '../../../admin/exams/types/exam.types';

const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

export const teacherExamService = {
  /**
   * Get exams for teacher's assigned classes
   */
  getExams: async (filters?: {
    classId?: string;
    subject?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ExamsResponse> => {
    const queryString = filters ? `?${buildQueryString(filters)}` : '';
    const endpoint = `${API_ENDPOINTS.TEACHER_EXAMS}${queryString}`;

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
    const endpoint = `${API_ENDPOINTS.TEACHER_EXAMS}/${id}`;

    const response = await httpClient.get<ExamDetailsApiResponse | ExamDetails>(endpoint);

    if ('success' in response && response.success) {
      return mapExamDetailsToDomain(response as ExamDetailsApiResponse);
    }

    return response as ExamDetails;
  },

  /**
   * Get list of students enrolled in an exam
   */
  getExamEnrollment: async (examId: string): Promise<ExamEnrollment> => {
    const endpoint = `${API_ENDPOINTS.TEACHER_EXAMS}/${examId}/enrollment`;

    const response = await httpClient.get<ExamEnrollmentApiResponse | ExamEnrollment>(endpoint);

    if ('success' in response && response.success) {
      return mapExamEnrollmentToDomain(response as ExamEnrollmentApiResponse);
    }

    return response as ExamEnrollment;
  },

  /**
   * Get upcoming exams for teacher's classes
   */
  getUpcomingExams: async (filters?: {
    classId?: string;
    limit?: number;
  }): Promise<ExamsResponse> => {
    const queryString = filters ? `?${buildQueryString(filters)}` : '';
    const endpoint = `${API_ENDPOINTS.TEACHER_EXAMS}/upcoming${queryString}`;

    const response = await httpClient.get<ExamsApiResponse | ExamsResponse>(endpoint);

    if ('success' in response && response.success) {
      return mapExamsResponseToDomain(response as ExamsApiResponse);
    }

    return response as ExamsResponse;
  },

  /**
   * Get exam calendar for teacher's classes
   */
  getExamCalendar: async (
    year: number,
    month: number,
    classId?: string
  ): Promise<ExamCalendar> => {
    const params: Record<string, unknown> = { year, month };
    if (classId) params.classId = classId;

    const queryString = buildQueryString(params);
    const endpoint = `${API_ENDPOINTS.TEACHER_EXAMS}/calendar?${queryString}`;

    const response = await httpClient.get<ExamCalendarApiResponse | ExamCalendar>(endpoint);

    if ('success' in response && response.success) {
      return mapExamCalendarToDomain(response as ExamCalendarApiResponse);
    }

    return response as ExamCalendar;
  },

  /**
   * Create a new exam (for teacher's assigned classes)
   */
  createExam: async (data: CreateExamData): Promise<ExamDetails> => {
    const dto = mapCreateExamToDTO(data);
    const endpoint = API_ENDPOINTS.TEACHER_EXAMS;

    const response = await httpClient.post<ExamDetailsApiResponse | ExamDetails>(endpoint, dto);

    if ('success' in response && response.success) {
      return mapExamDetailsToDomain(response as ExamDetailsApiResponse);
    }

    return response as ExamDetails;
  },

  /**
   * Update an exam (for teacher's assigned classes)
   */
  updateExam: async (id: string, data: Partial<CreateExamData>): Promise<ExamDetails> => {
    const dto = mapCreateExamToDTO(data as CreateExamData);
    const endpoint = `${API_ENDPOINTS.TEACHER_EXAMS}/${id}`;

    const response = await httpClient.put<ExamDetailsApiResponse | ExamDetails>(endpoint, dto);

    if ('success' in response && response.success) {
      return mapExamDetailsToDomain(response as ExamDetailsApiResponse);
    }

    return response as ExamDetails;
  },
};

