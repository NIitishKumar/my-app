/**
 * Classes API Service
 */

import { httpClient } from '../../../../services/http/httpClient';
import { classesEndpoints } from './classes.endpoints';
import type { Class, CreateClassData, UpdateClassData, ClassDTO, CreateClassDTO } from '../types/classes.types';

// Mapper functions
const mapClassToDomain = (dto: ClassDTO): Class => ({
  id: dto.id,
  name: dto.name,
  grade: dto.grade,
  section: dto.section,
  teacherId: dto.teacher_id,
  teacherName: dto.teacher_name,
  studentCount: dto.student_count,
  createdAt: new Date(dto.created_at),
  updatedAt: new Date(dto.updated_at),
});

const mapCreateClassToDTO = (data: CreateClassData): CreateClassDTO => ({
  name: data.name,
  grade: data.grade,
  section: data.section,
  teacher_id: data.teacherId,
});

// API functions
export const classesApi = {
  getAll: async (): Promise<Class[]> => {
    const response = await httpClient.get<ClassDTO[]>(classesEndpoints.list());
    return response.map(mapClassToDomain);
  },

  getById: async (id: string): Promise<Class> => {
    const response = await httpClient.get<ClassDTO>(classesEndpoints.detail(id));
    return mapClassToDomain(response);
  },

  create: async (data: CreateClassData): Promise<Class> => {
    const dto = mapCreateClassToDTO(data);
    const response = await httpClient.post<ClassDTO>(classesEndpoints.create(), dto);
    return mapClassToDomain(response);
  },

  update: async (data: UpdateClassData): Promise<Class> => {
    const { id, ...updateData } = data;
    const dto = mapCreateClassToDTO(updateData as CreateClassData);
    const response = await httpClient.put<ClassDTO>(classesEndpoints.update(id), dto);
    return mapClassToDomain(response);
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(classesEndpoints.delete(id));
  },
};


