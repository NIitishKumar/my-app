/**
 * Notices API Service
 * 
 * TODO: Replace mock data with actual API calls
 * To switch back to real API:
 * 1. Set USE_MOCK_DATA to false
 * 2. Uncomment the httpClient imports and API calls
 * 3. Remove mock data imports
 */

// Toggle between mock data and real API
const USE_MOCK_DATA = true;

import type {
  Notice,
  CreateNoticeData,
  UpdateNoticeData,
  NoticeApiDTO,
} from '../types/notices.types';

// Import mock data
import { mockNoticesApi } from './notices.mock';

// Uncomment these when switching back to real API
// import { httpClient } from '../../../services/http/httpClient';
// import { noticesEndpoints } from './notices.endpoints';
// import type {
//   NoticesApiResponse,
//   NoticeApiResponse,
//   CreateNoticeApiResponse,
//   UpdateNoticeApiResponse,
// } from '../types/notices.types';

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
  attachmentUrl: api.attachmentUrl,
  attachmentName: api.attachmentName,
  createdBy: api.createdBy,
  createdAt: new Date(api.createdAt),
  updatedAt: new Date(api.updatedAt),
});

// API functions
export const noticesApi = {
  getAll: async (filters?: { audience?: string; status?: string; priority?: string }): Promise<Notice[]> => {
    if (USE_MOCK_DATA) {
      // Use mock data
      const noticesData = await mockNoticesApi.getAll(filters);
      return noticesData.map(mapNoticeApiToDomain);
    }

    // Real API implementation (commented out for now)
    /*
    try {
      const queryParams = new URLSearchParams();
      if (filters?.audience) queryParams.append('audience', filters.audience);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.priority) queryParams.append('priority', filters.priority);

      const url = noticesEndpoints.list() + (queryParams.toString() ? `?${queryParams.toString()}` : '');
      const response = await httpClient.get<NoticesApiResponse | NoticeApiDTO[]>(url);

      let noticesData: NoticeApiDTO[];

      if (!response) {
        console.warn('API returned null or undefined response');
        return [];
      }

      if (Array.isArray(response)) {
        noticesData = response;
      } else if (typeof response === 'object' && 'data' in response) {
        const wrappedResponse = response as NoticesApiResponse;
        if (Array.isArray(wrappedResponse.data)) {
          noticesData = wrappedResponse.data;
        } else {
          console.warn('Response.data is not an array:', wrappedResponse.data);
          return [];
        }
      } else {
        console.warn('Unexpected API response structure:', response);
        return [];
      }

      if (!noticesData || !Array.isArray(noticesData)) {
        console.warn('noticesData is not a valid array:', noticesData);
        return [];
      }

      return noticesData.map(mapNoticeApiToDomain);
    } catch (error) {
      console.error('Error fetching notices:', error);
      throw error;
    }
    */
    return [];
  },

  getById: async (id: string): Promise<Notice> => {
    if (USE_MOCK_DATA) {
      const noticeData = await mockNoticesApi.getById(id);
      return mapNoticeApiToDomain(noticeData);
    }

    // Real API implementation (commented out for now)
    /*
    try {
      const response = await httpClient.get<NoticeApiResponse>(noticesEndpoints.detail(id));

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapNoticeApiToDomain(response.data);
    } catch (error) {
      console.error('Error fetching notice by ID:', error);
      throw error;
    }
    */
    throw new Error('Not implemented');
  },

  create: async (data: CreateNoticeData): Promise<Notice> => {
    if (USE_MOCK_DATA) {
      const payload: any = {
        title: data.title,
        description: data.description,
        audience: data.audience,
        priority: data.priority,
        ...(data.classIds && data.classIds.length > 0 && { classIds: data.classIds }),
        ...(data.publishAt && { publishAt: data.publishAt instanceof Date ? data.publishAt.toISOString() : data.publishAt }),
        ...(data.expiresAt && { expiresAt: data.expiresAt instanceof Date ? data.expiresAt.toISOString() : data.expiresAt }),
      };

      // If publishType is NOW, set publishAt to current time
      if (data.publishType === 'NOW') {
        payload.publishAt = new Date().toISOString();
      }

      const noticeData = await mockNoticesApi.create(payload);
      return mapNoticeApiToDomain(noticeData);
    }

    // Real API implementation (commented out for now)
    /*
    try {
      const payload: any = {
        title: data.title,
        description: data.description,
        audience: data.audience,
        priority: data.priority,
        ...(data.classIds && data.classIds.length > 0 && { classIds: data.classIds }),
        ...(data.publishAt && { publishAt: data.publishAt instanceof Date ? data.publishAt.toISOString() : data.publishAt }),
        ...(data.expiresAt && { expiresAt: data.expiresAt instanceof Date ? data.expiresAt.toISOString() : data.expiresAt }),
      };

      if (data.publishType === 'NOW') {
        payload.publishAt = new Date().toISOString();
      }

      const response = await httpClient.post<CreateNoticeApiResponse>(
        noticesEndpoints.create(),
        payload
      );

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapNoticeApiToDomain(response.data);
    } catch (error) {
      console.error('Error creating notice:', error);
      throw error;
    }
    */
    throw new Error('Not implemented');
  },

  update: async (data: UpdateNoticeData): Promise<Notice> => {
    if (USE_MOCK_DATA) {
      const { id, ...updateData } = data;

      const payload: any = {};
      if (updateData.title !== undefined) payload.title = updateData.title;
      if (updateData.description !== undefined) payload.description = updateData.description;
      if (updateData.audience !== undefined) payload.audience = updateData.audience;
      if (updateData.classIds !== undefined) payload.classIds = updateData.classIds;
      if (updateData.priority !== undefined) payload.priority = updateData.priority;
      if (updateData.publishAt !== undefined) {
        payload.publishAt = updateData.publishAt instanceof Date
          ? updateData.publishAt.toISOString()
          : updateData.publishAt;
      }
      if (updateData.expiresAt !== undefined) {
        payload.expiresAt = updateData.expiresAt instanceof Date
          ? updateData.expiresAt.toISOString()
          : updateData.expiresAt;
      }

      const noticeData = await mockNoticesApi.update(id, payload);
      return mapNoticeApiToDomain(noticeData);
    }

    // Real API implementation (commented out for now)
    /*
    try {
      const { id, ...updateData } = data;

      const payload: any = {};
      if (updateData.title !== undefined) payload.title = updateData.title;
      if (updateData.description !== undefined) payload.description = updateData.description;
      if (updateData.audience !== undefined) payload.audience = updateData.audience;
      if (updateData.classIds !== undefined) payload.classIds = updateData.classIds;
      if (updateData.priority !== undefined) payload.priority = updateData.priority;
      if (updateData.publishAt !== undefined) {
        payload.publishAt = updateData.publishAt instanceof Date
          ? updateData.publishAt.toISOString()
          : updateData.publishAt;
      }
      if (updateData.expiresAt !== undefined) {
        payload.expiresAt = updateData.expiresAt instanceof Date
          ? updateData.expiresAt.toISOString()
          : updateData.expiresAt;
      }

      const response = await httpClient.put<UpdateNoticeApiResponse>(
        noticesEndpoints.update(id),
        payload
      );

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapNoticeApiToDomain(response.data);
    } catch (error) {
      console.error('Error updating notice:', error);
      throw error;
    }
    */
    throw new Error('Not implemented');
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await mockNoticesApi.delete(id);
      return;
    }

    // Real API implementation (commented out for now)
    // await httpClient.delete(noticesEndpoints.delete(id));
    throw new Error('Not implemented');
  },
};
