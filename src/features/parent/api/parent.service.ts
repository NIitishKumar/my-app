/**
 * Parent Service
 */

import { httpClient } from '../../../services/http/httpClient';
import { API_ENDPOINTS } from '../../../services/endpoints';
import { ParentMapper } from './parent.mapper';
import type {
  Child,
  ChildAttendance,
  ChildRecord,
  Teacher,
  Query,
  CreateQueryData,
} from '../models/parent.model';
import type {
  ChildDTO,
  ChildAttendanceDTO,
  ChildRecordDTO,
  TeacherDTO,
  QueryDTO,
} from './parent.dto';

export const parentService = {
  // Children
  getChildren: async (): Promise<Child[]> => {
    const response = await httpClient.get<ChildDTO[]>(API_ENDPOINTS.PARENT_CHILDREN);
    return response.map(ParentMapper.childToDomain);
  },

  // Attendance
  getChildAttendance: async (childId: string): Promise<ChildAttendance> => {
    const response = await httpClient.get<ChildAttendanceDTO>(
      `${API_ENDPOINTS.PARENT_ATTENDANCE}/${childId}`
    );
    return ParentMapper.childAttendanceToDomain(response);
  },

  // Academic Records
  getChildRecords: async (childId: string): Promise<ChildRecord> => {
    const response = await httpClient.get<ChildRecordDTO>(
      `${API_ENDPOINTS.PARENT_RECORDS}/${childId}`
    );
    return ParentMapper.childRecordToDomain(response);
  },

  // Teachers
  getTeachers: async (childId: string): Promise<Teacher[]> => {
    const response = await httpClient.get<TeacherDTO[]>(
      `${API_ENDPOINTS.PARENT_TEACHERS}/${childId}`
    );
    return response.map(ParentMapper.teacherToDomain);
  },

  // Queries
  getQueries: async (): Promise<Query[]> => {
    const response = await httpClient.get<QueryDTO[]>(API_ENDPOINTS.PARENT_QUERIES);
    return response.map(ParentMapper.queryToDomain);
  },

  createQuery: async (data: CreateQueryData): Promise<Query> => {
    const dto = ParentMapper.createQueryToDTO(data);
    const response = await httpClient.post<QueryDTO>(
      API_ENDPOINTS.PARENT_QUERIES,
      dto
    );
    return ParentMapper.queryToDomain(response);
  },
};


