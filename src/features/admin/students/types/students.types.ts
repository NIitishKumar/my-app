/**
 * Students Domain Types
 */

export interface StudentAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  address?: StudentAddress;
  enrolledAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStudentData {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  address?: StudentAddress;
  enrolledAt: Date;
  isActive: boolean;
}

export interface UpdateStudentData extends Partial<CreateStudentData> {
  id: string;
}

// API DTOs
export interface StudentAddressDTO {
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export interface StudentDTO {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  student_id: string;
  age?: number;
  gender?: string;
  phone?: string;
  address?: StudentAddressDTO;
  enrolled_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateStudentDTO {
  first_name: string;
  last_name: string;
  email: string;
  student_id: string;
  age?: number;
  gender?: string;
  phone?: string;
  address?: StudentAddressDTO;
  enrolled_at: string;
  is_active: boolean;
}

