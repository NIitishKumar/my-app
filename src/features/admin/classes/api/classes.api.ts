/**
 * Classes API Service
 */

import { httpClient } from '../../../../services/http/httpClient';
import { classesEndpoints } from './classes.endpoints';
import type {
  Class,
  CreateClassData,
  UpdateClassData,
  ClassDTO,
  CreateClassDTO,
  ClassHead,
  ClassHeadDTO,
  ClassSchedule,
  ClassScheduleDTO,
  ClassApiDTO,
  ClassesApiResponse,
  ClassApiResponse,
  UpdateClassApiResponse,
  ClassHeadApiDTO,
  ClassScheduleApiDTO,
  CreateClassApiResponse,
} from '../types/classes.types';

// Mapper functions
const mapClassHeadToDomain = (dto: ClassHeadDTO): ClassHead => ({
  firstName: dto.first_name,
  lastName: dto.last_name,
  email: dto.email,
  employeeId: dto.employee_id,
});

const mapClassHeadToDTO = (head: ClassHead): ClassHeadDTO => ({
  first_name: head.firstName,
  last_name: head.lastName,
  email: head.email,
  employee_id: head.employeeId,
});

const mapScheduleToDomain = (dto: ClassScheduleDTO): ClassSchedule => ({
  academicYear: dto.academic_year,
  semester: dto.semester as 'Fall' | 'Spring' | 'Summer' | 'Winter',
  startDate: new Date(dto.start_date),
  endDate: new Date(dto.end_date),
});

const mapScheduleToDTO = (schedule: ClassSchedule): ClassScheduleDTO => ({
  academic_year: schedule.academicYear,
  semester: schedule.semester,
  start_date: schedule.startDate.toISOString().split('T')[0],
  end_date: schedule.endDate.toISOString().split('T')[0],
});



// Mapper for actual API response (camelCase with _id)
const mapClassHeadApiToDomain = (api: ClassHeadApiDTO | null | undefined): ClassHead => {
  };
};

const mapScheduleApiToDomain = (api: ClassScheduleApiDTO | null | undefined): ClassSchedule => {
  // Provide default values instead of throwing error
  if (!api) {
    const currentYear = new Date().getFullYear();
    return {
      academicYear: `${currentYear}-${currentYear + 1}`,
      semester: 'Fall',
      startDate: new Date(),
      endDate: new Date(),
    };
  }
  return {
    academicYear: api.academicYear || '',
    semester: (api.semester as 'Fall' | 'Spring' | 'Summer' | 'Winter') || 'Fall',
    startDate: api.startDate ? new Date(api.startDate) : new Date(),
    endDate: api.endDate ? new Date(api.endDate) : new Date(),
  };
};

const mapClassApiToDomain = (api: ClassApiDTO): Class => ({
  id: api._id,
  className: api.className,
  subjects: api.subjects || [],
  grade: api.grade,
  roomNo: api.roomNo,
  capacity: api.capacity,
  enrolled: api.enrolled,
  students: Array.isArray(api.students) ? api.students.map((student) => student._id) : [],
  classHead: mapClassHeadApiToDomain(api.classHead),
  lectures: Array.isArray(api.lectures) ? api.lectures.map((lecture) => lecture._id) : [],
  schedule: mapScheduleApiToDomain(api.schedule),
  isActive: api.isActive,
  createdAt: new Date(api.createdAt),
  updatedAt: new Date(api.updatedAt),
});

// Create API response uses the same format as ClassApiDTO (camelCase), so we can reuse mapClassApiToDomain

// API functions
export const classesApi = {
  getAll: async (): Promise<Class[]> => {
    try {
      const response = await httpClient.get<ClassesApiResponse | ClassApiDTO[]>(classesEndpoints.list());
      
      // Debug: Log the actual response structure
      console.log('Classes API Response:', response);
      
      // Handle both wrapped response and direct array response
      let classesData: ClassApiDTO[];
      
      if (!response) {
        console.warn('API returned null or undefined response');
        return [];
      }
      
      if (Array.isArray(response)) {
        // Direct array response
        classesData = response;
      } else if (typeof response === 'object' && 'data' in response) {
        // Wrapped response with { success, count, data }
        const wrappedResponse = response as ClassesApiResponse;
        if (Array.isArray(wrappedResponse.data)) {
          classesData = wrappedResponse.data;
        } else {
          console.warn('Response.data is not an array:', wrappedResponse.data);
          return [];
        }
      } else {
        // Unexpected response structure
        console.warn('Unexpected API response structure:', response);
        return [];
      }
      
      if (!classesData || !Array.isArray(classesData)) {
        console.warn('classesData is not a valid array:', classesData);
        return [];
      }
      
      if (classesData.length === 0) {
        return [];
      }
      
      return classesData.map(mapClassApiToDomain);
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Class> => {
    try {
      const response = await httpClient.get<ClassApiResponse>(classesEndpoints.detail(id));
      
      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }
      
      return mapClassApiToDomain(response.data);
    } catch (error) {
      console.error('Error fetching class by ID:', error);
      throw error;
    }
  },

  create: async (data: CreateClassData): Promise<Class> => {
    try {
      // Prepare payload in camelCase format (API expects camelCase)
      const payload: any = {
        className: data.className,
        subjects: data.subjects || [],
        grade: data.grade,
        roomNo: data.roomNo,
        capacity: data.capacity,
        enrolled: data.enrolled || 0,
        isActive: data.isActive,
        classHead: {
          firstName: data.classHead.firstName,
          lastName: data.classHead.lastName,
          email: data.classHead.email,
          employeeId: data.classHead.employeeId,
        },
        schedule: {
          academicYear: data.schedule.academicYear,
          semester: data.schedule.semester,
          // Convert Date objects to YYYY-MM-DD format
          startDate: data.schedule.startDate instanceof Date
            ? data.schedule.startDate.toISOString().split('T')[0]
            : data.schedule.startDate,
          endDate: data.schedule.endDate instanceof Date
            ? data.schedule.endDate.toISOString().split('T')[0]
            : data.schedule.endDate,
        },
        students: data.students || [],
        lectures: data.lectures || [],
      };

      console.log('Creating class with payload:', payload);
      
      const response = await httpClient.post<CreateClassApiResponse>(
        classesEndpoints.create(),
        payload
      );
      
      console.log('Create API response:', response);
      
      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }
      
      // Create API response uses camelCase format (same as ClassApiDTO), so reuse the existing mapper
      return mapClassApiToDomain(response.data);
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  },

  update: async (data: UpdateClassData): Promise<Class> => {
    try {
      const { id, ...updateData } = data;
      
      // Prepare update payload - convert Date objects to ISO strings for schedule dates
      const payload: any = { ...updateData };
      
      // Convert schedule dates to ISO strings if present
      if (payload.schedule) {
        payload.schedule = {
          ...payload.schedule,
          startDate: payload.schedule.startDate instanceof Date 
            ? payload.schedule.startDate.toISOString() 
            : payload.schedule.startDate,
          endDate: payload.schedule.endDate instanceof Date 
            ? payload.schedule.endDate.toISOString() 
            : payload.schedule.endDate,
        };
      }
      
      // Log the payload for debugging
      console.log('Updating class with payload:', payload);
      console.log('Update endpoint:', classesEndpoints.update(id));
      
      // Send camelCase data directly (API accepts camelCase)
      const response = await httpClient.put<UpdateClassApiResponse>(
        classesEndpoints.update(id),
        payload
      );
      
      console.log('Update API response:', response);
      
      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }
      
      return mapClassApiToDomain(response.data);
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(classesEndpoints.delete(id));
  },
};


