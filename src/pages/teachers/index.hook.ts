import { httpClient } from '../../services/http/httpClient';
import type { LectureApiDTO, LectureTeacher } from '../classes/index.types';
import { teachersEndpoints } from './api/teachers.endpoints';
import type { Teacher, TeacherApiDTO, TeachersApiResponse, TeachersQueryParams } from './index.constant';

const mapTeacherApiToDomain = (api: LectureApiDTO['teacher'] | any): LectureTeacher => {
  // Handle both object with teacherId and nested teacher object
  if (typeof api === 'string') {
    // If it's just an ID string, return empty object (will be populated separately)
    return {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      teacherId: api,
    };
  }

  // Handle nested teacher object from API
  if (api && typeof api === 'object') {
    return {
      id: api._id,
      firstName: api.firstName || '',
      lastName: api.lastName || '',
      email: api.email || '',
      teacherId: api.teacherId || api.employeeId || api._id || '',
    };
  }

  return {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    teacherId: '',
  };
};

export const teachersApi = {
  /**
   * Get all teachers with pagination and filters
   */
  getAll: async (
    params?: TeachersQueryParams,
  ): Promise<{ teachers: Teacher[]; pagination: { count: number; total: number; page: number; limit: number; pages: number } }> => {
    try {
      const response = await httpClient.get<TeachersApiResponse | TeacherApiDTO[]>(teachersEndpoints.list(), params);

      // Handle both wrapped response and direct array response
      let teachersData: TeacherApiDTO[];
      let pagination = {
        count: 0,
        total: 0,
        page: 1,
        limit: 10,
        pages: 1,
      };

      if (Array.isArray(response)) {
        // Direct array response
        teachersData = response;
        pagination.count = response.length;
        pagination.total = response.length;
      } else if (typeof response === 'object' && 'data' in response) {
        // Wrapped response with pagination
        const wrappedResponse = response as TeachersApiResponse;
        teachersData = wrappedResponse.data || [];
        pagination = {
          count: wrappedResponse.count || teachersData.length,
          total: wrappedResponse.total || teachersData.length,
          page: wrappedResponse.page || 1,
          limit: wrappedResponse.limit || 10,
          pages: wrappedResponse.pages || 1,
        };
      } else {
        console.warn('Unexpected API response structure:', response);
        teachersData = [];
      }

      return {
        teachers: teachersData.map(mapTeacherApiToDomain),
        pagination,
      };
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
  },
};
