/**
 * Lectures API Service
 */

import { httpClient } from '../../../../services/http/httpClient';
import { lecturesEndpoints } from './lectures.endpoints';
import type {
  Lecture,
  CreateLectureData,
  UpdateLectureData,
  LectureApiDTO,
  LecturesApiResponse,
  LectureApiResponse,
  CreateLectureApiResponse,
  UpdateLectureApiResponse,
  DeleteLectureApiResponse,
  LectureTeacher,
  LectureSchedule,
  LectureMaterial,
} from '../types/lectures.types';

// Mapper: API DTO to Domain
const mapTeacherApiToDomain = (api: LectureApiDTO['teacher']): LectureTeacher => {
  return {
    firstName: api.firstName,
    lastName: api.lastName,
    email: api.email,
    teacherId: api.teacherId,
  };
};

const mapScheduleApiToDomain = (api: LectureApiDTO['schedule']): LectureSchedule => {
  return {
    dayOfWeek: api.dayOfWeek as LectureSchedule['dayOfWeek'],
    startTime: api.startTime,
    endTime: api.endTime,
    room: api.room,
  };
};

const mapMaterialApiToDomain = (api: LectureApiDTO['materials'][0]): LectureMaterial => {
  return {
    name: api.name,
    type: api.type as LectureMaterial['type'],
    url: api.url,
  };
};

const mapLectureApiToDomain = (api: LectureApiDTO): Lecture => {
  return {
    id: api._id,
    title: api.title,
    description: api.description,
    subject: api.subject,
    teacher: mapTeacherApiToDomain(api.teacher),
    schedule: mapScheduleApiToDomain(api.schedule),
    duration: api.duration,
    type: (api.type || 'lecture') as Lecture['type'],
    materials: (api.materials || []).map(mapMaterialApiToDomain),
    isActive: api.isActive ?? true,
    createdAt: api.createdAt ? new Date(api.createdAt) : undefined,
    updatedAt: api.updatedAt ? new Date(api.updatedAt) : undefined,
  };
};

// Mapper: Domain to API DTO (for create)
const mapCreateLectureDataToApi = (data: CreateLectureData): Partial<LectureApiDTO> => {
  return {
    title: data.title,
    description: data.description,
    subject: data.subject,
    teacher: {
      firstName: data.teacher.firstName,
      lastName: data.teacher.lastName,
      email: data.teacher.email.toLowerCase(),
      teacherId: data.teacher.teacherId,
    },
    schedule: {
      dayOfWeek: data.schedule.dayOfWeek,
      startTime: data.schedule.startTime,
      endTime: data.schedule.endTime,
      room: data.schedule.room,
    },
    duration: data.duration,
    type: data.type || 'lecture',
    materials: data.materials || [],
    isActive: data.isActive ?? true,
  };
};

// Mapper: Domain to API DTO (for update - handles partial updates)
const mapUpdateLectureDataToApi = (data: Partial<CreateLectureData>): Partial<LectureApiDTO> => {
  const payload: Partial<LectureApiDTO> = {};

  if (data.title !== undefined) payload.title = data.title;
  if (data.description !== undefined) payload.description = data.description;
  if (data.subject !== undefined) payload.subject = data.subject;
  if (data.duration !== undefined) payload.duration = data.duration;
  if (data.type !== undefined) payload.type = data.type;
  if (data.isActive !== undefined) payload.isActive = data.isActive;
  if (data.materials !== undefined) payload.materials = data.materials;
  
  if (data.teacher) {
    payload.teacher = {
      firstName: data.teacher.firstName,
      lastName: data.teacher.lastName,
      email: data.teacher.email.toLowerCase(),
      teacherId: data.teacher.teacherId,
    };
  }
  
  if (data.schedule) {
    payload.schedule = {
      dayOfWeek: data.schedule.dayOfWeek,
      startTime: data.schedule.startTime,
      endTime: data.schedule.endTime,
      room: data.schedule.room,
    };
  }

  return payload;
};

// API Service
export const lecturesApi = {
  /**
   * Get all lectures
   */
  getAll: async (): Promise<Lecture[]> => {
    try {
      const response = await httpClient.get<LecturesApiResponse | LectureApiDTO[]>(
        lecturesEndpoints.list()
      );

      // Handle both wrapped response and direct array response
      let lecturesData: LectureApiDTO[];

      if (Array.isArray(response)) {
        // Direct array response
        lecturesData = response;
      } else if (typeof response === 'object' && 'data' in response) {
        // Wrapped response
        const wrappedResponse = response as LecturesApiResponse;
        lecturesData = wrappedResponse.data || [];
      } else {
        console.warn('Unexpected API response structure:', response);
        lecturesData = [];
      }

      // Filter out items that don't have the required structure (e.g., items with 'class' and 'assignedTeacher' instead of 'teacher' and 'schedule')
      const validLectures = lecturesData.filter((item) => {
        // Check if item has the expected structure
        return item && 
               item._id && 
               item.title && 
               item.subject && 
               item.teacher && 
               item.teacher.firstName && 
               item.teacher.lastName &&
               item.schedule &&
               item.schedule.dayOfWeek &&
               item.schedule.startTime &&
               item.schedule.endTime &&
               typeof item.duration === 'number';
      });

      return validLectures.map(mapLectureApiToDomain);
    } catch (error) {
      console.error('Error fetching lectures:', error);
      throw error;
    }
  },

  /**
   * Get lecture by ID
   */
  getById: async (id: string): Promise<Lecture> => {
    try {
      const response = await httpClient.get<LectureApiResponse>(lecturesEndpoints.detail(id));

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapLectureApiToDomain(response.data);
    } catch (error) {
      console.error('Error fetching lecture by ID:', error);
      throw error;
    }
  },

  /**
   * Create lecture
   */
  create: async (data: CreateLectureData): Promise<Lecture> => {
    try {
      const payload = mapCreateLectureDataToApi(data);

      const response = await httpClient.post<CreateLectureApiResponse>(
        lecturesEndpoints.create(),
        payload
      );

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapLectureApiToDomain(response.data);
    } catch (error) {
      console.error('Error creating lecture:', error);
      throw error;
    }
  },

  /**
   * Update lecture (supports partial updates)
   */
  update: async (data: UpdateLectureData): Promise<Lecture> => {
    try {
      const { id, ...updateData } = data;
      const payload = mapUpdateLectureDataToApi(updateData);

      const response = await httpClient.put<UpdateLectureApiResponse>(
        lecturesEndpoints.update(id),
        payload
      );

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapLectureApiToDomain(response.data);
    } catch (error) {
      console.error('Error updating lecture:', error);
      throw error;
    }
  },

  /**
   * Delete lecture
   */
  delete: async (id: string): Promise<void> => {
    try {
      await httpClient.delete<DeleteLectureApiResponse>(lecturesEndpoints.delete(id));
    } catch (error) {
      console.error('Error deleting lecture:', error);
      throw error;
    }
  },
};
