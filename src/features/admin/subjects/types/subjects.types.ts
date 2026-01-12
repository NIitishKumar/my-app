/**
 * Subjects Domain Types
 */

export interface Subject {
  id: string;
  name: string;
  price: number;
  author: string;
  description?: string;
  classes: string[]; // Array of class IDs
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubjectData {
  name: string;
  price: number;
  author: string;
  description?: string;
  classes: string[]; // Array of class IDs
  isActive: boolean;
}

export interface UpdateSubjectData extends Partial<CreateSubjectData> {
  id: string;
}

// API DTOs (snake_case format)
export interface SubjectDTO {
  id: string;
  name: string;
  price: number;
  author: string;
  description?: string;
  classes: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSubjectDTO {
  name: string;
  price: number;
  author: string;
  description?: string;
  classes: string[];
  is_active: boolean;
}

// Actual API Response Types (camelCase with _id)
export interface SubjectApiDTO {
  _id: string;
  name: string;
  price: number;
  author: string;
  description?: string;
  classes: string[] | Array<{ _id: string; className?: string }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectsApiResponse {
  success: boolean;
  count: number;
  data: SubjectApiDTO[];
}

export interface SubjectApiResponse {
  success: boolean;
  data: SubjectApiDTO;
}

export interface CreateSubjectApiResponse {
  success: boolean;
  message: string;
  data: SubjectApiDTO;
}

export interface UpdateSubjectApiResponse {
  success: boolean;
  message: string;
  data: SubjectApiDTO;
}

