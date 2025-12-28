/**
 * Students API Service
 */

import { httpClient } from '../../../../services/http/httpClient';
import { studentsEndpoints } from './students.endpoints';
import type {
  Student,
  CreateStudentData,
  UpdateStudentData,
  StudentApiDTO,
  StudentListApiDTO,
  StudentsApiResponse,
  StudentApiResponse,
  CreateStudentApiResponse,
  UpdateStudentApiResponse,
  StudentAddress,
  StudentAddressApiDTO,
} from '../types/students.types';

// Mapper: API DTO to Domain
const mapAddressApiToDomain = (api?: StudentAddressApiDTO): StudentAddress | undefined => {
  if (!api) return undefined;
  return {
    street: api.street,
    city: api.city,
    state: api.state,
    zipCode: api.zipCode,
  };
};

const mapStudentApiToDomain = (api: StudentApiDTO | StudentListApiDTO): Student => {
  // Handle both full StudentApiDTO and projected StudentListApiDTO
  const isFullData = 'age' in api || 'address' in api || 'enrolledAt' in api;
  
  if (isFullData) {
    const fullApi = api as StudentApiDTO;
    return {
      id: fullApi._id,
      firstName: fullApi.firstName,
      lastName: fullApi.lastName,
      email: fullApi.email,
      studentId: fullApi.studentId,
      age: fullApi.age,
      gender: fullApi.gender,
      phone: fullApi.phone,
      grade: fullApi.grade,
      address: mapAddressApiToDomain(fullApi.address),
      enrolledAt: fullApi.enrolledAt ? new Date(fullApi.enrolledAt) : undefined,
      isActive: fullApi.isActive ?? true,
      createdAt: fullApi.createdAt ? new Date(fullApi.createdAt) : undefined,
      updatedAt: fullApi.updatedAt ? new Date(fullApi.updatedAt) : undefined,
    };
  } else {
    // Projected fields only (from list endpoint)
    const listApi = api as StudentListApiDTO;
    return {
      id: listApi._id,
      firstName: listApi.firstName,
      lastName: listApi.lastName,
      email: listApi.email,
      studentId: listApi.studentId,
      grade: listApi.grade,
      isActive: true, // Default since not in projected fields
    };
  }
};

// Mapper: Domain to API DTO (for create)
const mapCreateStudentToApi = (data: CreateStudentData): Partial<StudentApiDTO> => {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    studentId: data.studentId,
    age: data.age,
    gender: data.gender,
    phone: data.phone,
    grade: data.grade,
    address: data.address
      ? {
          street: data.address.street,
          city: data.address.city,
          state: data.address.state,
          zipCode: data.address.zipCode,
        }
      : undefined,
    // Don't send enrolledAt or isActive - API auto-generates them
  };
};

// API Service
export const studentsApi = {
  /**
   * Get all students (returns projected fields only)
   */
  getAll: async (): Promise<Student[]> => {
    try {
      const response = await httpClient.get<StudentsApiResponse | StudentListApiDTO[]>(
        studentsEndpoints.list()
      );

      // Handle both wrapped response and direct array response
      let studentsData: StudentListApiDTO[];

      if (Array.isArray(response)) {
        // Direct array response
        studentsData = response;
      } else if (typeof response === 'object' && 'data' in response) {
        // Wrapped response
        const wrappedResponse = response as StudentsApiResponse;
        studentsData = wrappedResponse.data || [];
      } else {
        console.warn('Unexpected API response structure:', response);
        studentsData = [];
      }

      return studentsData.map(mapStudentApiToDomain);
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  /**
   * Get student by ID (returns full details)
   */
  getById: async (id: string): Promise<Student> => {
    try {
      const response = await httpClient.get<StudentApiResponse>(studentsEndpoints.detail(id));

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapStudentApiToDomain(response.data);
    } catch (error) {
      console.error('Error fetching student by ID:', error);
      throw error;
    }
  },

  /**
   * Create student
   */
  create: async (data: CreateStudentData): Promise<Student> => {
    try {
      const payload = mapCreateStudentToApi(data);

      const response = await httpClient.post<CreateStudentApiResponse>(
        studentsEndpoints.create(),
        payload
      );

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapStudentApiToDomain(response.data);
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },

  /**
   * Update student
   */
  update: async (data: UpdateStudentData): Promise<Student> => {
    try {
      const { id, ...updateData } = data;
      const payload = mapCreateStudentToApi(updateData as CreateStudentData);

      const response = await httpClient.put<UpdateStudentApiResponse>(
        studentsEndpoints.update(id),
        payload
      );

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapStudentApiToDomain(response.data);
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  /**
   * Delete student
   */
  delete: async (id: string): Promise<void> => {
    try {
      await httpClient.delete(studentsEndpoints.delete(id));
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },
};
