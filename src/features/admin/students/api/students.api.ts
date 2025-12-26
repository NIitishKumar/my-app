/**
 * Students API Service
 */

import { httpClient } from '../../../../services/http/httpClient';
import { studentsEndpoints } from './students.endpoints';
import type {
  Student,
  CreateStudentData,
  UpdateStudentData,
  StudentDTO,
  CreateStudentDTO,
  StudentAddress,
  StudentAddressDTO,
} from '../types/students.types';

// Mapper functions
const mapAddressToDomain = (dto?: StudentAddressDTO): StudentAddress | undefined => {
  if (!dto) return undefined;
  return {
    street: dto.street,
    city: dto.city,
    state: dto.state,
    zipCode: dto.zip_code,
  };
};

const mapAddressToDTO = (address?: StudentAddress): StudentAddressDTO | undefined => {
  if (!address) return undefined;
  return {
    street: address.street,
    city: address.city,
    state: address.state,
    zip_code: address.zipCode,
  };
};

const mapStudentToDomain = (dto: StudentDTO): Student => ({
  id: dto.id,
  firstName: dto.first_name,
  lastName: dto.last_name,
  email: dto.email,
  studentId: dto.student_id,
  age: dto.age,
  gender: dto.gender as 'male' | 'female' | 'other' | undefined,
  phone: dto.phone,
  address: mapAddressToDomain(dto.address),
  enrolledAt: new Date(dto.enrolled_at),
  isActive: dto.is_active,
  createdAt: new Date(dto.created_at),
  updatedAt: new Date(dto.updated_at),
});

const mapCreateStudentToDTO = (data: CreateStudentData): CreateStudentDTO => ({
  first_name: data.firstName,
  last_name: data.lastName,
  email: data.email,
  student_id: data.studentId,
  age: data.age,
  gender: data.gender,
  phone: data.phone,
  address: mapAddressToDTO(data.address),
  enrolled_at: data.enrolledAt.toISOString().split('T')[0],
  is_active: data.isActive,
});

// API functions
export const studentsApi = {
  getAll: async (): Promise<Student[]> => {
    const response = await httpClient.get<StudentDTO[]>(studentsEndpoints.list());
    return response.map(mapStudentToDomain);
  },

  getById: async (id: string): Promise<Student> => {
    const response = await httpClient.get<StudentDTO>(studentsEndpoints.detail(id));
    return mapStudentToDomain(response);
  },

  create: async (data: CreateStudentData): Promise<Student> => {
    const dto = mapCreateStudentToDTO(data);
    const response = await httpClient.post<StudentDTO>(studentsEndpoints.create(), dto);
    return mapStudentToDomain(response);
  },

  update: async (data: UpdateStudentData): Promise<Student> => {
    const { id, ...updateData } = data;
    const dto = mapCreateStudentToDTO(updateData as CreateStudentData);
    const response = await httpClient.put<StudentDTO>(studentsEndpoints.update(id), dto);
    return mapStudentToDomain(response);
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(studentsEndpoints.delete(id));
  },
};

