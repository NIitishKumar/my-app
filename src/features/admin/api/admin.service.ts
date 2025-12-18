/**
 * Admin Service
 */

import { httpClient } from '../../../services/http/httpClient';
import { API_ENDPOINTS } from '../../../services/endpoints';
import { AdminMapper } from './admin.mapper';
import type {
  Class,
  CreateClassData,
  UpdateClassData,
  Teacher,
  CreateTeacherData,
  UpdateTeacherData,
  Lecture,
  CreateLectureData,
  UpdateLectureData,
  Report,
} from '../models/admin.model';
import type { ClassDTO, TeacherDTO, LectureDTO, ReportDTO } from './admin.dto';

export const adminService = {
  // Classes
  getClasses: async (): Promise<Class[]> => {
    const response = await httpClient.get<ClassDTO[]>(API_ENDPOINTS.ADMIN_CLASSES);
    return response.map(AdminMapper.classToDomain);
  },

  getClass: async (id: string): Promise<Class> => {
    const response = await httpClient.get<ClassDTO>(
      `${API_ENDPOINTS.ADMIN_CLASSES}/${id}`
    );
    return AdminMapper.classToDomain(response);
  },

  createClass: async (data: CreateClassData): Promise<Class> => {
    const dto = AdminMapper.createClassToDTO(data);
    const response = await httpClient.post<ClassDTO>(
      API_ENDPOINTS.ADMIN_CLASSES,
      dto
    );
    return AdminMapper.classToDomain(response);
  },

  updateClass: async (data: UpdateClassData): Promise<Class> => {
    const { id, ...updateData } = data;
    const dto = AdminMapper.createClassToDTO(updateData as CreateClassData);
    const response = await httpClient.put<ClassDTO>(
      `${API_ENDPOINTS.ADMIN_CLASSES}/${id}`,
      dto
    );
    return AdminMapper.classToDomain(response);
  },

  deleteClass: async (id: string): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.ADMIN_CLASSES}/${id}`);
  },

  // Teachers
  getTeachers: async (): Promise<Teacher[]> => {
    const response = await httpClient.get<TeacherDTO[]>(API_ENDPOINTS.ADMIN_TEACHERS);
    return response.map(AdminMapper.teacherToDomain);
  },

  getTeacher: async (id: string): Promise<Teacher> => {
    const response = await httpClient.get<TeacherDTO>(
      `${API_ENDPOINTS.ADMIN_TEACHERS}/${id}`
    );
    return AdminMapper.teacherToDomain(response);
  },

  createTeacher: async (data: CreateTeacherData): Promise<Teacher> => {
    const dto = AdminMapper.createTeacherToDTO(data);
    const response = await httpClient.post<TeacherDTO>(
      API_ENDPOINTS.ADMIN_TEACHERS,
      dto
    );
    return AdminMapper.teacherToDomain(response);
  },

  updateTeacher: async (data: UpdateTeacherData): Promise<Teacher> => {
    const { id, ...updateData } = data;
    const response = await httpClient.put<TeacherDTO>(
      `${API_ENDPOINTS.ADMIN_TEACHERS}/${id}`,
      updateData
    );
    return AdminMapper.teacherToDomain(response);
  },

  deleteTeacher: async (id: string): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.ADMIN_TEACHERS}/${id}`);
  },

  // Lectures
  getLectures: async (): Promise<Lecture[]> => {
    const response = await httpClient.get<LectureDTO[]>(API_ENDPOINTS.ADMIN_LECTURES);
    return response.map(AdminMapper.lectureToDomain);
  },

  getLecture: async (id: string): Promise<Lecture> => {
    const response = await httpClient.get<LectureDTO>(
      `${API_ENDPOINTS.ADMIN_LECTURES}/${id}`
    );
    return AdminMapper.lectureToDomain(response);
  },

  createLecture: async (data: CreateLectureData): Promise<Lecture> => {
    const dto = AdminMapper.createLectureToDTO(data);
    const response = await httpClient.post<LectureDTO>(
      API_ENDPOINTS.ADMIN_LECTURES,
      dto
    );
    return AdminMapper.lectureToDomain(response);
  },

  updateLecture: async (data: UpdateLectureData): Promise<Lecture> => {
    const { id, ...updateData } = data;
    const dto = AdminMapper.createLectureToDTO(updateData as CreateLectureData);
    const response = await httpClient.put<LectureDTO>(
      `${API_ENDPOINTS.ADMIN_LECTURES}/${id}`,
      dto
    );
    return AdminMapper.lectureToDomain(response);
  },

  deleteLecture: async (id: string): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.ADMIN_LECTURES}/${id}`);
  },

  // Reports
  getReports: async (): Promise<Report[]> => {
    const response = await httpClient.get<ReportDTO[]>(API_ENDPOINTS.ADMIN_REPORTS);
    return response.map(AdminMapper.reportToDomain);
  },
};


