/**
 * Teachers API Service
 */

import { httpClient } from '../../../../services/http/httpClient';
import { teachersEndpoints } from './teachers.endpoints';
import { teacherDTOToTeacher, teacherToCreateTeacherDTO } from '../utils/teachers.utils';
import type { Teacher, CreateTeacherData, UpdateTeacherData, TeacherDTO, CreateTeacherDTO } from '../types/teachers.types';

export const teachersApi = {
  getAll: async (): Promise<Teacher[]> => {
    const response = await httpClient.get<TeacherDTO[]>(teachersEndpoints.list());
    return response.map(teacherDTOToTeacher);
  },

  getById: async (id: string): Promise<Teacher> => {
    const response = await httpClient.get<TeacherDTO>(teachersEndpoints.detail(id));
    return teacherDTOToTeacher(response);
  },

  create: async (data: CreateTeacherData): Promise<Teacher> => {
    const dto = teacherToCreateTeacherDTO(data);
    const response = await httpClient.post<TeacherDTO>(teachersEndpoints.create(), dto);
    return teacherDTOToTeacher(response);
  },

  update: async (data: UpdateTeacherData): Promise<Teacher> => {
    const { id, ...updateData } = data;
    const dto = teacherToCreateTeacherDTO(updateData as CreateTeacherData);
    const response = await httpClient.put<TeacherDTO>(teachersEndpoints.update(id), dto);
    return teacherDTOToTeacher(response);
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(teachersEndpoints.delete(id));
  },
};
