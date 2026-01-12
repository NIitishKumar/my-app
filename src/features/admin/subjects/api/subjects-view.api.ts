/**
 * Subjects View API Service - For teachers, students, and parents (read-only)
 */

import { httpClient } from '../../../../services/http/httpClient';
import { subjectsViewEndpoints } from './subjects-view.endpoints';
import { mapSubjectApiToDomain } from './subjects.mapper';
import type {
  Subject,
  SubjectApiDTO,
  SubjectsApiResponse,
  SubjectApiResponse,
} from '../types/subjects.types';

// API functions (read-only)
export const subjectsViewApi = {
  getAll: async (): Promise<Subject[]> => {
    try {
      const response = await httpClient.get<SubjectsApiResponse | SubjectApiDTO[]>(
        subjectsViewEndpoints.list()
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
      const response = await httpClient.get<SubjectApiResponse>(subjectsViewEndpoints.detail(id));

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapSubjectApiToDomain(response.data);
    } catch (error) {
      console.error('Error fetching subject by ID:', error);
      throw error;
    }
  },
};

