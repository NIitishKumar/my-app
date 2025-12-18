/**
 * Teachers API Service
 */

import { httpClient } from '../../../../services/http/httpClient';
import { teachersEndpoints } from './teachers.endpoints';
import type { Teacher, CreateTeacherData, UpdateTeacherData, TeacherDTO, CreateTeacherDTO } from '../types/teachers.types';

const mapTeacherToDomain = (dto: TeacherDTO): Teacher => ({
  id: dto.id,
  name: dto.name,
  email: dto.email,
  phone: dto.phone,
  subject: dto.subject,
  classes: dto.classes,
  createdAt: new Date(dto.created_at),
  updatedAt: new Date(dto.updated_at),
});

const mapCreateTeacherToDTO = (data: CreateTeacherData): CreateTeacherDTO => ({
  name: data.name,
  email: data.email,
  phone: data.phone,
  subject: data.subject,
  password: data.password,
});

export const teachersApi = {
  getAll: async (): Promise<Teacher[]> => {
    const response = await httpClient.get<TeacherDTO[]>(teachersEndpoints.list());
    return response.map(mapTeacherToDomain);
  },

  getById: async (id: string): Promise<Teacher> => {
    const response = await httpClient.get<TeacherDTO>(teachersEndpoints.detail(id));
    return mapTeacherToDomain(response);
  },

  create: async (data: CreateTeacherData): Promise<Teacher> => {
    const dto = mapCreateTeacherToDTO(data);
    const response = await httpClient.post<TeacherDTO>(teachersEndpoints.create(), dto);
    return mapTeacherToDomain(response);
  },

  update: async (data: UpdateTeacherData): Promise<Teacher> => {
    const { id, ...updateData } = data;
    const response = await httpClient.put<TeacherDTO>(teachersEndpoints.update(id), updateData);
    return mapTeacherToDomain(response);
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(teachersEndpoints.delete(id));
  },
};


