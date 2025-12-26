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

const mapClassToDomain = (dto: ClassDTO): Class => ({
  id: dto.id,
  className: dto.class_name,
  subjects: dto.subjects,
  grade: dto.grade,
  roomNo: dto.room_no,
  capacity: dto.capacity,
  enrolled: dto.enrolled,
  students: dto.students,
  classHead: mapClassHeadToDomain(dto.class_head),
  lectures: dto.lectures,
  schedule: mapScheduleToDomain(dto.schedule),
  isActive: dto.is_active,
  createdAt: new Date(dto.created_at),
  updatedAt: new Date(dto.updated_at),
});

const mapCreateClassToDTO = (data: CreateClassData): CreateClassDTO => ({
  class_name: data.className,
  subjects: data.subjects,
  grade: data.grade,
  room_no: data.roomNo,
  capacity: data.capacity,
  enrolled: data.enrolled || 0,
  students: data.students || [],
  class_head: mapClassHeadToDTO(data.classHead),
  lectures: data.lectures || [],
  schedule: mapScheduleToDTO(data.schedule),
  is_active: data.isActive,
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


