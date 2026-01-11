/**
 * Teacher Classes API Service
 */

import { httpClient } from '../../../../services/http/httpClient';
import { teacherClassesEndpoints } from './teacher-classes.endpoints';
import type {
  TeacherClass,
  ClassSummary,
  TeacherClassDTO,
  TeacherClassesApiResponse,
  TeacherClassApiResponse,
} from '../types/teacher-classes.types';
import type { ClassHead, ClassSchedule } from '../../../admin/classes/types/classes.types';

// Mapper functions
const mapClassHeadToDomain = (dto: TeacherClassDTO['classHead']): ClassHead | null => {
  if (!dto) {
    return {
      firstName: '',
      lastName: '',
      email: '',
      employeeId: '',
    };
  }
  return {
    firstName: dto.firstName || '',
    lastName: dto.lastName || '',
    email: dto.email || '',
    employeeId: dto.employeeId || '',
  };
};

const mapScheduleToDomain = (dto: TeacherClassDTO['schedule']): ClassSchedule | null => {
  if (!dto) {
    const currentYear = new Date().getFullYear();
    return {
      academicYear: `${currentYear}-${currentYear + 1}`,
      semester: 'Fall',
      startDate: new Date(),
      endDate: new Date(),
    };
  }
  return {
    academicYear: dto.academicYear || '',
    semester: (dto.semester as 'Fall' | 'Spring' | 'Summer' | 'Winter') || 'Fall',
    startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
    endDate: dto.endDate ? new Date(dto.endDate) : new Date(),
  };
};

const mapTeacherClassToDomain = (dto: TeacherClassDTO): TeacherClass => {
  const classHead = mapClassHeadToDomain(dto.classHead);
  const schedule = mapScheduleToDomain(dto.schedule);

  return {
    id: dto._id,
    className: dto.className,
    subjects: dto.subjects || [],
    grade: dto.grade,
    roomNo: dto.roomNo,
    capacity: dto.capacity,
    enrolled: dto.enrolled,
    students: Array.isArray(dto.students) ? dto.students.map((s) => s._id) : [],
    classHead: classHead || {
      firstName: '',
      lastName: '',
      email: '',
      employeeId: '',
    },
    lectures: Array.isArray(dto.lectures) ? dto.lectures.map((l) => l._id) : [],
    schedule: schedule || {
      academicYear: '',
      semester: 'Fall',
      startDate: new Date(),
      endDate: new Date(),
    },
    isActive: dto.isActive,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    // Teacher-specific fields
    subject: dto.subject,
    attendanceRate: dto.attendanceRate,
    lastAttendanceDate: dto.lastAttendanceDate ? new Date(dto.lastAttendanceDate) : undefined,
  };
};


// API functions
export const teacherClassesApi = {
  /**
   * Get all classes assigned to the logged-in teacher
   */
  getAssignedClasses: async (): Promise<TeacherClass[]> => {
    try {
      const response = await httpClient.get<
        TeacherClassesApiResponse | TeacherClassDTO[]
      >(teacherClassesEndpoints.list());

      let classesData: TeacherClassDTO[];

      if (!response) {
        console.warn('API returned null or undefined response');
        return [];
      }

      if (Array.isArray(response)) {
        classesData = response;
      } else if (typeof response === 'object' && 'data' in response) {
        const wrappedResponse = response as TeacherClassesApiResponse;
        if (Array.isArray(wrappedResponse.data)) {
          classesData = wrappedResponse.data;
        } else {
          console.warn('Response.data is not an array:', wrappedResponse.data);
          return [];
        }
      } else {
        console.warn('Unexpected API response structure:', response);
        return [];
      }

      if (!classesData || !Array.isArray(classesData)) {
        console.warn('classesData is not a valid array:', classesData);
        return [];
      }

      // Validate each class object has required fields
      const validClasses = classesData.filter((cls) => {
        return cls && 
               cls._id && 
               cls.className && 
               cls.grade &&
               typeof cls.enrolled === 'number' &&
               typeof cls.capacity === 'number';
      });

      if (validClasses.length !== classesData.length) {
        console.warn(`${classesData.length - validClasses.length} classes were filtered out due to missing required fields`);
      }

      return validClasses.map(mapTeacherClassToDomain);
    } catch (error: any) {
      // Handle specific error cases
      if (error?.status === 403) {
        throw new Error('You are not assigned to any classes. Please contact your administrator.');
      }
      if (error?.status === 401) {
        throw new Error('Your session has expired. Please login again.');
      }
      console.error('Error fetching teacher classes:', error);
      throw error;
    }
  },

  /**
   * Get class summaries (lightweight version for lists)
   */
  getClassSummaries: async (): Promise<ClassSummary[]> => {
    try {
      const classes = await teacherClassesApi.getAssignedClasses();
      return classes.map((cls) => ({
        id: cls.id,
        className: cls.className,
        grade: cls.grade,
        studentCount: cls.enrolled,
        attendanceRate: cls.attendanceRate,
        roomNo: cls.roomNo,
        isActive: cls.isActive,
        lastAttendanceDate: cls.lastAttendanceDate,
        subject: cls.subject,
      }));
    } catch (error) {
      console.error('Error fetching class summaries:', error);
      throw error;
    }
  },

  /**
   * Get detailed class information
   */
  getClassDetails: async (classId: string): Promise<TeacherClass> => {
    try {
      const response = await httpClient.get<TeacherClassApiResponse>(
        teacherClassesEndpoints.detail(classId)
      );

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      // Validate required fields
      if (!response.data._id || !response.data.className || !response.data.grade) {
        throw new Error('Invalid class data: missing required fields');
      }

      return mapTeacherClassToDomain(response.data);
    } catch (error: any) {
      if (error?.status === 403) {
        throw new Error('You are not assigned to this class.');
      }
      if (error?.status === 404) {
        throw new Error('Class not found.');
      }
      if (error?.status === 401) {
        throw new Error('Your session has expired. Please login again.');
      }
      console.error('Error fetching class details:', error);
      throw error;
    }
  },
};

