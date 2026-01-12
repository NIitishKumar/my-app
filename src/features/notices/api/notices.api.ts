/**
 * Notices API Service
 */

import type {
  Notice,
  CreateNoticeData,
  UpdateNoticeData,
  NoticeApiDTO,
  NoticesApiResponse,
  NoticeApiResponse,
  CreateNoticeApiResponse,
  UpdateNoticeApiResponse,
} from '../types/notices.types';
import { httpClient } from '../../../services/http/httpClient';
import { noticesEndpoints } from './notices.endpoints';

// Mapper functions
const mapNoticeApiToDomain = (api: NoticeApiDTO): Notice => ({
  id: api._id,
  title: api.title,
  description: api.description,
  audience: api.audience as Notice['audience'],
  classIds: api.classIds || [],
  priority: api.priority as Notice['priority'],
  status: api.status as Notice['status'],
  publishAt: new Date(api.publishAt),
  expiresAt: api.expiresAt ? new Date(api.expiresAt) : undefined,
  attachmentUrl: api.attachmentUrl || undefined,
  attachmentName: api.attachmentName || undefined,
  createdBy: api.createdBy,
  createdAt: new Date(api.createdAt),
  updatedAt: new Date(api.updatedAt),
});

// API functions
export const noticesApi = {
  getAll: async (filters?: { audience?: string; status?: string; priority?: string }): Promise<Notice[]> => {
    try {
      const queryParams: Record<string, string> = {};
      if (filters?.audience) queryParams.audience = filters.audience;
      if (filters?.status) queryParams.status = filters.status;
      if (filters?.priority) queryParams.priority = filters.priority;

      const response = await httpClient.get<NoticesApiResponse>(
        noticesEndpoints.list(),
        Object.keys(queryParams).length > 0 ? queryParams : undefined
      );

      if (!response || !response.success) {
        console.warn('API returned invalid response:', response);
        return [];
      }

      if (!Array.isArray(response.data)) {
        console.warn('Response.data is not an array:', response.data);
        return [];
      }

      return response.data.map(mapNoticeApiToDomain);
    } catch (error) {
      console.error('Error fetching notices:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Notice> => {
    try {
      const response = await httpClient.get<NoticeApiResponse>(noticesEndpoints.detail(id));

      if (!response || !response.success || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapNoticeApiToDomain(response.data);
    } catch (error) {
      console.error('Error fetching notice by ID:', error);
      throw error;
    }
  },

  create: async (data: CreateNoticeData): Promise<Notice> => {
    try {
      const payload: Record<string, any> = {
        title: data.title,
        description: data.description,
        audience: data.audience,
        priority: data.priority,
      };

      // Handle classIds: send empty array for ALL audience, or the provided array
      if (data.audience === 'ALL') {
        payload.classIds = data.classIds || [];
      } else {
        // For non-ALL audiences, classIds is required
        payload.classIds = data.classIds || [];
      }

      // Handle publishAt based on publishType
      // If publishType is NOW and no publishAt provided, don't send publishAt (backend uses current time)
      // If publishType is SCHEDULED, publishAt should be provided
      if (data.publishAt) {
        payload.publishAt = data.publishAt instanceof Date 
          ? data.publishAt.toISOString() 
          : data.publishAt;
      }
      // If publishType is NOW and no publishAt, backend will automatically set it to current time

      // Handle expiresAt: send as ISO string or omit
      if (data.expiresAt) {
        payload.expiresAt = data.expiresAt instanceof Date 
          ? data.expiresAt.toISOString() 
          : data.expiresAt;
      }

      const response = await httpClient.post<CreateNoticeApiResponse>(
        noticesEndpoints.create(),
        payload
      );

      if (!response || !response.success || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapNoticeApiToDomain(response.data);
    } catch (error) {
      console.error('Error creating notice:', error);
      throw error;
    }
  },

  update: async (data: UpdateNoticeData): Promise<Notice> => {
    try {
      const { id, ...updateData } = data;

      const payload: Record<string, any> = {};
      
      if (updateData.title !== undefined) payload.title = updateData.title;
      if (updateData.description !== undefined) payload.description = updateData.description;
      if (updateData.audience !== undefined) payload.audience = updateData.audience;
      if (updateData.priority !== undefined) payload.priority = updateData.priority;
      
      // Handle classIds
      if (updateData.classIds !== undefined) {
        payload.classIds = updateData.classIds;
      } else if (updateData.audience !== undefined) {
        // If audience is being updated, ensure classIds is set appropriately
        if (updateData.audience === 'ALL') {
          payload.classIds = [];
        }
      }
      
      // Handle publishAt
      if (updateData.publishAt !== undefined) {
        if (updateData.publishAt === null) {
          // If explicitly set to null, don't include it (or handle based on backend requirements)
          // For now, we'll omit it if null
        } else {
          payload.publishAt = updateData.publishAt instanceof Date
            ? updateData.publishAt.toISOString()
            : updateData.publishAt;
        }
      }
      
      // Handle expiresAt: send as ISO string, null, or omit
      if (updateData.expiresAt !== undefined) {
        if (updateData.expiresAt === null) {
          payload.expiresAt = null;
        } else {
          payload.expiresAt = updateData.expiresAt instanceof Date
            ? updateData.expiresAt.toISOString()
            : updateData.expiresAt;
        }
      }

      const response = await httpClient.put<UpdateNoticeApiResponse>(
        noticesEndpoints.update(id),
        payload
      );

      if (!response || !response.success || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapNoticeApiToDomain(response.data);
    } catch (error) {
      console.error('Error updating notice:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await httpClient.delete(noticesEndpoints.delete(id));
    } catch (error) {
      console.error('Error deleting notice:', error);
      throw error;
    }
  },
};
