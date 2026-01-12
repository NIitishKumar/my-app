/**
 * Subjects API Service
 */

import { httpClient } from '../../../../services/http/httpClient';
import { subjectsEndpoints } from './subjects.endpoints';
import { mapSubjectApiToDomain, mapCreateSubjectToDTO, mapUpdateSubjectToDTO } from './subjects.mapper';
import type {
  Subject,
  CreateSubjectData,
  UpdateSubjectData,
  SubjectApiDTO,
  SubjectsApiResponse,
  SubjectApiResponse,
  CreateSubjectApiResponse,
  UpdateSubjectApiResponse,
} from '../types/subjects.types';

// API functions
export const subjectsApi = {
  getAll: async (): Promise<Subject[]> => {
    try {
      const response = await httpClient.get<SubjectsApiResponse | SubjectApiDTO[]>(
        subjectsEndpoints.list()
      );

      // Handle both wrapped response and direct array response
      let subjectsData: SubjectApiDTO[];

      if (!response) {
        console.warn('API returned null or undefined response');
        return [];
      }

      if (Array.isArray(response)) {
        // Direct array response
        subjectsData = response;
      } else if (typeof response === 'object' && 'data' in response) {
        // Wrapped response with { success, count, data }
        const wrappedResponse = response as SubjectsApiResponse;
        if (Array.isArray(wrappedResponse.data)) {
          subjectsData = wrappedResponse.data;
        } else {
          console.warn('Response.data is not an array:', wrappedResponse.data);
          return [];
        }
      } else {
        // Unexpected response structure
        console.warn('Unexpected API response structure:', response);
        return [];
      }

      if (!subjectsData || !Array.isArray(subjectsData)) {
        console.warn('subjectsData is not a valid array:', subjectsData);
        return [];
      }

      if (subjectsData.length === 0) {
        return [];
      }

      return subjectsData.map(mapSubjectApiToDomain);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Subject> => {
    try {
      const response = await httpClient.get<SubjectApiResponse>(subjectsEndpoints.detail(id));

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapSubjectApiToDomain(response.data);
    } catch (error) {
      console.error('Error fetching subject by ID:', error);
      throw error;
    }
  },

  create: async (data: CreateSubjectData): Promise<Subject> => {
    try {
      const payload = mapCreateSubjectToDTO(data);

      console.log('Creating subject with payload:', payload);

      const response = await httpClient.post<CreateSubjectApiResponse>(
        subjectsEndpoints.create(),
        payload
      );

      console.log('Create API response:', response);

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapSubjectApiToDomain(response.data);
    } catch (error) {
      console.error('Error creating subject:', error);
      throw error;
    }
  },

  update: async (data: UpdateSubjectData): Promise<Subject> => {
    try {
      const { id, ...updateData } = data;
      const payload = mapUpdateSubjectToDTO(updateData);

      console.log('Updating subject with payload:', payload);
      console.log('Update endpoint:', subjectsEndpoints.update(id));

      const response = await httpClient.put<UpdateSubjectApiResponse>(
        subjectsEndpoints.update(id),
        payload
      );

      console.log('Update API response:', response);

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapSubjectApiToDomain(response.data);
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(subjectsEndpoints.delete(id));
  },
};

