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
const mapTeacherApiToDomain = (api: LectureApiDTO['teacher'] | any): LectureTeacher => {
  // Handle both object with teacherId and nested teacher object
  if (typeof api === 'string') {
    // If it's just an ID string, return empty object (will be populated separately)
    return {
      firstName: '',
      lastName: '',
      email: '',
      teacherId: api,
    };
  }
  
  // Handle nested teacher object from API
  if (api && typeof api === 'object') {
    return {
      firstName: api.firstName || '',
      lastName: api.lastName || '',
      email: api.email || '',
      teacherId: api.teacherId || api.employeeId || api._id || '',
    };
  }
  
  return {
    firstName: '',
    lastName: '',
    email: '',
    teacherId: '',
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

const mapLectureApiToDomain = (api: LectureApiDTO & { classId?: string | any }): Lecture => {
  // Extract classId - can be string ID or nested class object
  let classId: string | undefined;
  if (api.classId) {
    if (typeof api.classId === 'string') {
      classId = api.classId;
    } else if (api.classId && typeof api.classId === 'object' && api.classId._id) {
      classId = api.classId._id;
    }
  }
  
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
    classId: classId,
    lectureGroup: api.lectureGroup,
    createdAt: api.createdAt ? new Date(api.createdAt) : undefined,
    updatedAt: api.updatedAt ? new Date(api.updatedAt) : undefined,
  };
};

// Mapper: Domain to API DTO (for create)
const mapCreateLectureDataToApi = (data: CreateLectureData): Partial<LectureApiDTO> => {
  const payload: any = {
    title: data.title,
    description: data.description,
    subject: data.subject,
    // If teacherId is provided, use it; otherwise use teacher object
    teacher: typeof data.teacher === 'string' || data.teacherId
      ? (data.teacherId || data.teacher)
      : {
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
  
  // Include classId if provided
  if (data.classId) {
    payload.classId = data.classId;
  }
  
  // Include lectureGroup if provided
  if (data.lectureGroup) {
    payload.lectureGroup = data.lectureGroup;
  }
  
  return payload;
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
    // If teacherId is provided or teacher is a string, use it; otherwise use teacher object
    if (typeof data.teacher === 'string' || data.teacherId) {
      payload.teacher = data.teacherId || data.teacher;
    } else {
      payload.teacher = {
        firstName: data.teacher.firstName,
        lastName: data.teacher.lastName,
        email: data.teacher.email.toLowerCase(),
        teacherId: data.teacher.teacherId,
      };
    }
  }
  
  if (data.schedule) {
    payload.schedule = {
      dayOfWeek: data.schedule.dayOfWeek,
      startTime: data.schedule.startTime,
      endTime: data.schedule.endTime,
      room: data.schedule.room,
    };
  }
  
  if (data.classId !== undefined) {
    payload.classId = data.classId;
  }
  
  if (data.lectureGroup !== undefined) {
    payload.lectureGroup = data.lectureGroup;
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
      const response = await httpClient.get<LectureApiResponse | { success: boolean; count: number; data: LectureApiDTO[] }>(lecturesEndpoints.detail(id));

      if (!response) {
        throw new Error('Invalid API response: missing data');
      }

      // Handle wrapped response with array in data
      let lectureData: LectureApiDTO;
      if (Array.isArray((response as any).data)) {
        const arrayResponse = response as { success: boolean; count: number; data: LectureApiDTO[] };
        if (!arrayResponse.data || arrayResponse.data.length === 0) {
          throw new Error('Lecture not found');
        }
        lectureData = arrayResponse.data[0];
      } else if ((response as LectureApiResponse).data) {
        // Standard response format
        lectureData = (response as LectureApiResponse).data;
      } else {
        throw new Error('Invalid API response structure');
      }

      return mapLectureApiToDomain(lectureData);
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
