/**
 * Attendance API Service
 */

import { httpClient } from '../../../../../services/http/httpClient';
import { attendanceEndpoints } from './attendance.endpoints';
import {
  mapAttendanceRecordApiToDomain,
  mapMarkAttendanceToDTO,
} from './attendance.mapper';
import type {
  AttendanceRecord,
  MarkAttendanceData,
  UpdateAttendanceData,
  AttendanceFilters,
  AttendanceRecordsApiResponse,
  AttendanceRecordApiResponse,
  MarkAttendanceApiResponse,
  AttendanceRecordApiDTO,
} from '../types/attendance.types';

// API functions
export const attendanceApi = {
  /**
   * Get all attendance records for a class
   */
  getByClass: async (
    classId: string,
    filters?: AttendanceFilters
  ): Promise<AttendanceRecord[]> => {
    try {
      // Build query params (camelCase as per API docs)
      const params = new URLSearchParams();
      if (filters?.startDate) {
        params.append('startDate', filters.startDate.toISOString().split('T')[0]);
      }
      if (filters?.endDate) {
        params.append('endDate', filters.endDate.toISOString().split('T')[0]);
      }
      if (filters?.lectureId) {
        params.append('lectureId', filters.lectureId);
      }
      if (filters?.status) {
        params.append('status', filters.status);
      }

      const queryString = params.toString();
      const endpoint = queryString
        ? `${attendanceEndpoints.list(classId)}?${queryString}`
        : attendanceEndpoints.list(classId);

      const response = await httpClient.get<
        AttendanceRecordsApiResponse | AttendanceRecordApiDTO[]
      >(endpoint);

      // Handle both wrapped response and direct array response
      let recordsData: AttendanceRecordApiDTO[];

      if (!response) {
        console.warn('API returned null or undefined response');
        return [];
      }

      if (Array.isArray(response)) {
        recordsData = response;
      } else if (typeof response === 'object' && 'data' in response) {
        const wrappedResponse = response as AttendanceRecordsApiResponse;
        if (Array.isArray(wrappedResponse.data)) {
          recordsData = wrappedResponse.data;
        } else {
          console.warn('Response.data is not an array:', wrappedResponse.data);
          return [];
        }
      } else {
        console.warn('Unexpected API response structure:', response);
        return [];
      }

      if (!recordsData || !Array.isArray(recordsData)) {
        console.warn('recordsData is not a valid array:', recordsData);
        return [];
      }

      if (recordsData.length === 0) {
        return [];
      }

      return recordsData.map(mapAttendanceRecordApiToDomain);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      throw error;
    }
  },

  /**
   * Get attendance for a specific date
   */
  getByDate: async (classId: string, date: string): Promise<AttendanceRecord | null> => {
    try {
      const response = await httpClient.get<AttendanceRecordApiResponse>(
        attendanceEndpoints.byDate(classId, date)
      );

      if (!response || !response.data) {
        return null;
      }

      return mapAttendanceRecordApiToDomain(response.data);
    } catch (error: any) {
      // Return null for 404 (no attendance record found for date)
      if (error?.status === 404) {
        return null;
      }
      console.error('Error fetching attendance by date:', error);
      throw error;
    }
  },

  /**
   * Get attendance for a specific lecture
   */
  getByLecture: async (
    classId: string,
    lectureId: string
  ): Promise<AttendanceRecord[]> => {
    try {
      const response = await httpClient.get<
        AttendanceRecordsApiResponse | AttendanceRecordApiDTO[]
      >(attendanceEndpoints.byLecture(classId, lectureId));

      let recordsData: AttendanceRecordApiDTO[];

      if (!response) {
        return [];
      }

      if (Array.isArray(response)) {
        recordsData = response;
      } else if (typeof response === 'object' && 'data' in response) {
        const wrappedResponse = response as AttendanceRecordsApiResponse;
        recordsData = Array.isArray(wrappedResponse.data) ? wrappedResponse.data : [];
      } else {
        return [];
      }

      return recordsData.map(mapAttendanceRecordApiToDomain);
    } catch (error) {
      console.error('Error fetching attendance by lecture:', error);
      throw error;
    }
  },

  /**
   * Mark attendance (create or update)
   */
  mark: async (data: MarkAttendanceData): Promise<AttendanceRecord> => {
    try {
      const payload = mapMarkAttendanceToDTO(data);

      const response = await httpClient.post<MarkAttendanceApiResponse>(
        attendanceEndpoints.create(data.classId),
        payload
      );

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapAttendanceRecordApiToDomain(response.data);
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  },

  /**
   * Update attendance record
   */
  update: async (data: UpdateAttendanceData): Promise<AttendanceRecord> => {
    try {
      const { recordId, ...updateData } = data;
      const classId = updateData.classId || '';

      if (!recordId) {
        throw new Error('recordId is required for updating attendance');
      }

      if (!classId) {
        throw new Error('classId is required for updating attendance');
      }

      // Convert to API format (camelCase as per API docs)
      const payload: {
        date?: string;
        students?: Array<{
          studentId: string;
          status: string;
          remarks?: string;
        }>;
        lectureId?: string;
        version?: number;
      } = {};
      if (updateData.date) {
        payload.date = updateData.date;
      }
      if (updateData.lectureId !== undefined) {
        payload.lectureId = updateData.lectureId;
      }
      if (updateData.students) {
        payload.students = updateData.students.map((student) => ({
          studentId: student.studentId,
          status: student.status,
          remarks: student.remarks,
        }));
      }

      const response = await httpClient.put<MarkAttendanceApiResponse>(
        attendanceEndpoints.update(classId, recordId),
        payload
      );

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapAttendanceRecordApiToDomain(response.data);
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  },

  /**
   * Delete attendance record
   */
  delete: async (classId: string, recordId: string): Promise<void> => {
    try {
      await httpClient.delete(attendanceEndpoints.delete(classId, recordId));
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      throw error;
    }
  },
};

