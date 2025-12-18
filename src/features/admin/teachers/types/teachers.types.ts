/**
 * Teachers Domain Types
 */

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  classes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTeacherData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  password: string;
}

export interface UpdateTeacherData extends Partial<Omit<CreateTeacherData, 'password'>> {
  id: string;
}

// API DTOs
export interface TeacherDTO {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  classes: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateTeacherDTO {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  password: string;
}


