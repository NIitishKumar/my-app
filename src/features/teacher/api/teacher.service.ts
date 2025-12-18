/**
 * Teacher Service
 */

import { httpClient } from '../../../services/http/httpClient';
import { API_ENDPOINTS } from '../../../services/endpoints';
import { TeacherMapper } from './teacher.mapper';
import type {
  AssignedClass,
  AttendanceRecord,
  MarkAttendanceData,
  Query,
  CreateQueryData,
} from '../models/teacher.model';
import type {
  AssignedClassDTO,
  AttendanceRecordDTO,
  QueryDTO,
} from './teacher.dto';

export const teacherService = {
  // Classes
  getAssignedClasses: async (): Promise<AssignedClass[]> => {
    const response = await httpClient.get<AssignedClassDTO[]>(
      API_ENDPOINTS.TEACHER_CLASSES
    );
    return response.map(TeacherMapper.assignedClassToDomain);
  },

  // Attendance
  getAttendanceRecords: async (): Promise<AttendanceRecord[]> => {
    const response = await httpClient.get<AttendanceRecordDTO[]>(
      API_ENDPOINTS.TEACHER_ATTENDANCE
    );
    return response.map(TeacherMapper.attendanceRecordToDomain);
  },

  getAttendanceRecord: async (id: string): Promise<AttendanceRecord> => {
    const response = await httpClient.get<AttendanceRecordDTO>(
      `${API_ENDPOINTS.TEACHER_ATTENDANCE}/${id}`
    );
    return TeacherMapper.attendanceRecordToDomain(response);
  },

  markAttendance: async (data: MarkAttendanceData): Promise<AttendanceRecord> => {
    const dto = TeacherMapper.markAttendanceToDTO(data);
    const response = await httpClient.post<AttendanceRecordDTO>(
      API_ENDPOINTS.TEACHER_ATTENDANCE,
      dto
    );
    return TeacherMapper.attendanceRecordToDomain(response);
  },

  // Queries
  getQueries: async (): Promise<Query[]> => {
    const response = await httpClient.get<QueryDTO[]>(
      API_ENDPOINTS.TEACHER_QUERIES
    );
    return response.map(TeacherMapper.queryToDomain);
  },

  getQuery: async (id: string): Promise<Query> => {
    const response = await httpClient.get<QueryDTO>(
      `${API_ENDPOINTS.TEACHER_QUERIES}/${id}`
    );
    return TeacherMapper.queryToDomain(response);
  },

  createQuery: async (data: CreateQueryData): Promise<Query> => {
    const dto = TeacherMapper.createQueryToDTO(data);
    const response = await httpClient.post<QueryDTO>(
      API_ENDPOINTS.TEACHER_QUERIES,
      dto
    );
    return TeacherMapper.queryToDomain(response);
  },
};


