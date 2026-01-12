/**
 * Subjects Mapper
 * Maps API DTOs to domain models and vice versa
 */

import type {
  Subject,
  CreateSubjectData,
  SubjectApiDTO,
  SubjectsApiResponse,
  SubjectApiResponse,
  CreateSubjectApiResponse,
  UpdateSubjectApiResponse,
} from '../types/subjects.types';

/**
 * Map API response (camelCase with _id) to domain model
 */
export const mapSubjectApiToDomain = (api: SubjectApiDTO): Subject => {
  // Handle classes - can be array of strings (IDs) or array of objects with _id
  const classIds: string[] = Array.isArray(api.classes)
    ? api.classes.map((cls) => (typeof cls === 'string' ? cls : cls._id))
    : [];

  return {
    id: api._id,
    name: api.name || '',
    price: api.price || 0,
    author: api.author || '',
    description: api.description,
    classes: classIds,
    isActive: api.isActive ?? true,
    createdAt: api.createdAt ? new Date(api.createdAt) : new Date(),
    updatedAt: api.updatedAt ? new Date(api.updatedAt) : new Date(),
  };
};

/**
 * Map domain model to create DTO (camelCase format for API)
 */
export const mapCreateSubjectToDTO = (data: CreateSubjectData) => {
  return {
    name: data.name,
    price: data.price,
    author: data.author,
    description: data.description || '',
    classes: data.classes || [],
    isActive: data.isActive,
  };
};

/**
 * Map domain model to update DTO (camelCase format for API)
 */
export const mapUpdateSubjectToDTO = (data: Partial<CreateSubjectData>) => {
  const dto: any = {};
  
  if (data.name !== undefined) dto.name = data.name;
  if (data.price !== undefined) dto.price = data.price;
  if (data.author !== undefined) dto.author = data.author;
  if (data.description !== undefined) dto.description = data.description;
  if (data.classes !== undefined) dto.classes = data.classes;
  if (data.isActive !== undefined) dto.isActive = data.isActive;
  
  return dto;
};

