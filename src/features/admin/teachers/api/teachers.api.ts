/**
 * Teachers API Service
 */

import { httpClient } from '../../../../services/http/httpClient';
import { teachersEndpoints } from './teachers.endpoints';
import type {
  Teacher,
  CreateTeacherData,
  UpdateTeacherData,
  TeachersQueryParams,
  TeacherApiDTO,
  TeachersApiResponse,
  TeacherApiResponse,
  TeachersByDepartmentResponse,
  TeachersStatsResponse,
  TeacherWithClassesResponse,
  AddClassToTeacherRequest,
  RemoveClassFromTeacherRequest,
  AddClassToTeacherResponse,
  RemoveClassFromTeacherResponse,
  ClassReference,
} from '../types/teachers.types';

// Mapper: API DTO to Domain
const mapTeacherApiToDomain = (api: TeacherApiDTO): Teacher => {
  // Handle classes - can be string[] or ClassReference[]
  let classes: string[] | ClassReference[] = [];
  if (api.classes) {
    if (Array.isArray(api.classes)) {
      if (api.classes.length > 0 && typeof api.classes[0] === 'string') {
        classes = api.classes as string[];
      } else {
        classes = api.classes as ClassReference[];
      }
    }
  }

  return {
    id: api._id,
    firstName: api.firstName,
    lastName: api.lastName,
    email: api.email,
    employeeId: api.employeeId,
    phone: api.phone,
    department: api.department,
    qualification: api.qualification,
    specialization: api.specialization,
    subjects: api.subjects || [],
    status: api.status,
    employmentType: api.employmentType,
    experience: api.experience,
    joiningDate: api.joiningDate ? new Date(api.joiningDate) : undefined,
    isActive: api.isActive ?? true,
    classes,
    createdAt: api.createdAt ? new Date(api.createdAt) : undefined,
    updatedAt: api.updatedAt ? new Date(api.updatedAt) : undefined,
  };
};

// Mapper: Domain to API DTO (for create/update)
const mapCreateTeacherToApi = (data: CreateTeacherData): Partial<TeacherApiDTO> => {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    employeeId: data.employeeId,
    phone: data.phone,
    department: data.department,
    qualification: data.qualification,
    specialization: data.specialization,
    subjects: data.subjects || [],
    status: data.status || 'active',
    employmentType: data.employmentType || 'full-time',
    experience: data.experience,
    joiningDate: data.joiningDate,
  };
};

// API Service
export const teachersApi = {
  /**
   * Get all teachers with pagination and filters
   */
  getAll: async (params?: TeachersQueryParams): Promise<{ teachers: Teacher[]; pagination: { count: number; total: number; page: number; limit: number; pages: number } }> => {
    try {
      const response = await httpClient.get<TeachersApiResponse | TeacherApiDTO[]>(
        teachersEndpoints.list(),
        params
      );

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

  /**
   * Get teacher by ID
   */
  getById: async (id: string): Promise<Teacher> => {
    try {
      const response = await httpClient.get<TeacherApiResponse>(teachersEndpoints.detail(id));

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapTeacherApiToDomain(response.data);
    } catch (error) {
      console.error('Error fetching teacher by ID:', error);
      throw error;
    }
  },

  /**
   * Get teachers by department
   */
  getByDepartment: async (department: string): Promise<Teacher[]> => {
    try {
      const response = await httpClient.get<TeachersByDepartmentResponse>(
        teachersEndpoints.byDepartment(department)
      );

      if (!response || !response.data) {
        return [];
      }

      return response.data.map(mapTeacherApiToDomain);
    } catch (error) {
      console.error('Error fetching teachers by department:', error);
      throw error;
    }
  },

  /**
   * Get teacher statistics
   */
  getStats: async () => {
    try {
      const response = await httpClient.get<TeachersStatsResponse>(teachersEndpoints.stats());

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching teacher statistics:', error);
      throw error;
    }
  },

  /**
   * Get teacher with classes
   */
  getWithClasses: async (id: string): Promise<Teacher> => {
    try {
      const response = await httpClient.get<TeacherWithClassesResponse>(
        teachersEndpoints.teacherWithClasses(id)
      );

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapTeacherApiToDomain(response.data);
    } catch (error) {
      console.error('Error fetching teacher with classes:', error);
      throw error;
    }
  },

  /**
   * Create teacher
   */
  create: async (data: CreateTeacherData): Promise<Teacher> => {
    try {
      const payload = mapCreateTeacherToApi(data);

      const response = await httpClient.post<TeacherApiResponse>(
        teachersEndpoints.create(),
        payload
      );

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapTeacherApiToDomain(response.data);
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw error;
    }
  },

  /**
   * Update teacher
   */
  update: async (data: UpdateTeacherData): Promise<Teacher> => {
    try {
      const { id, ...updateData } = data;
      const payload = mapCreateTeacherToApi(updateData as CreateTeacherData);

      const response = await httpClient.put<TeacherApiResponse>(
        teachersEndpoints.update(id),
        payload
      );

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapTeacherApiToDomain(response.data);
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  },

  /**
   * Add class to teacher
   */
  addClass: async (teacherId: string, classId: string): Promise<void> => {
    try {
      const payload: AddClassToTeacherRequest = { classId };
      await httpClient.post<AddClassToTeacherResponse>(
        teachersEndpoints.addClass(teacherId),
        payload
      );
    } catch (error) {
      console.error('Error adding class to teacher:', error);
      throw error;
    }
  },

  /**
   * Remove class from teacher
   */
  removeClass: async (teacherId: string, classId: string): Promise<void> => {
    try {
      const payload: RemoveClassFromTeacherRequest = { classId };
      await httpClient.delete<RemoveClassFromTeacherResponse>(
        teachersEndpoints.removeClass(teacherId),
        payload
      );
    } catch (error) {
      console.error('Error removing class from teacher:', error);
      throw error;
    }
  },

  /**
   * Delete teacher (soft delete)
   */
  delete: async (id: string): Promise<void> => {
    try {
      await httpClient.delete(teachersEndpoints.delete(id));
    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw error;
    }
  },

  /**
   * Hard delete teacher (permanent)
   */
  hardDelete: async (id: string): Promise<void> => {
    try {
      await httpClient.delete(teachersEndpoints.hardDelete(id));
    } catch (error) {
      console.error('Error hard deleting teacher:', error);
      throw error;
    }
  },
};
