/**
 * Teacher Attendance API Service
 * Following backend API specification with proper error handling
 */

import { httpClient } from '../../../../services/http/httpClient';
import { apiClient } from '../../../../services/api';
import { attendanceEndpoints } from './attendance.endpoints';
import {
  mapAttendanceRecordApiToDomain,
  mapAttendanceRecordsApiResponse,
  mapAttendanceDashboardApiResponse,
  mapAttendanceStatisticsApiResponse,
  mapStudentAttendanceHistoryApiResponse,
  mapMarkAttendanceToDTO,
  mapUpdateAttendanceToDTO,
} from './attendance.mapper';
import type {
  AttendanceRecord,
  AttendanceDashboardData,
  AttendanceStatistics,
  StudentAttendanceHistory,
  MarkAttendanceData,
  UpdateAttendanceData,
  AttendanceFilters,
  AttendanceQueryParams,
  StatisticsQueryParams,
  StudentHistoryQueryParams,
  DashboardQueryParams,
  ExportQueryParams,
  AttendanceRecordsResponse,
  AttendanceRecordApiDTO,
  AttendanceRecordsApiResponse,
  AttendanceDashboardApiResponse,
  AttendanceStatisticsApiResponse,
  StudentAttendanceHistoryApiResponse,
  MarkAttendanceApiResponse,
  AttendanceRecordApiResponse,
} from '../types/attendance.types';
import type { BackendSuccessResponse } from '../../../../shared/types/api.types';

/**
 * Build query string from params
 */
const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

/**
 * Get attendance dashboard data
 * GET /api/teacher/attendance/dashboard
 */
export const getAttendanceDashboard = async (
  params?: DashboardQueryParams
): Promise<AttendanceDashboardData> => {
  try {
    const queryString = params ? buildQueryString(params as Record<string, unknown>) : '';
    const endpoint = queryString
      ? `${attendanceEndpoints.dashboard}?${queryString}`
      : attendanceEndpoints.dashboard;

    const response = await httpClient.get<AttendanceDashboardApiResponse>(endpoint);
    
    // Backend returns { success: true, data: {...} }
    if (response.success && response.data) {
      return mapAttendanceDashboardApiResponse(response);
    }
    
    throw new Error('Invalid API response: missing data');
  } catch (error) {
    console.error('Error fetching attendance dashboard:', error);
    throw error;
  }
};

/**
 * Get all attendance records with filters and pagination
 * GET /api/teacher/attendance
 * Query params: classId, startDate, endDate, lectureId, status, page, limit
 */
export const getAttendanceRecords = async (
  filters?: AttendanceFilters
): Promise<AttendanceRecordsResponse> => {
  try {
    const params: AttendanceQueryParams = {};
    
    if (filters?.classId) params.classId = filters.classId;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.lectureId) params.lectureId = filters.lectureId;
    if (filters?.status) params.status = filters.status;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    const queryString = buildQueryString(params as unknown as Record<string, unknown>);
    const endpoint = queryString
      ? `${attendanceEndpoints.list}?${queryString}`
      : attendanceEndpoints.list;

    const response = await httpClient.get<AttendanceRecordsApiResponse>(endpoint);
    
    // Backend returns { success: true, data: { count, page, totalPages, data: [...] } }
    if (response.success && response.data) {
      return mapAttendanceRecordsApiResponse(response);
    }
    
    throw new Error('Invalid API response: missing data');
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }
};

/**
 * Get attendance for a specific date
 * GET /api/attendance/classes/:classId/attendance/date/:date
 */
export const getAttendanceByDate = async (
  classId: string,
  date: string
): Promise<AttendanceRecord | null> => {
  try {
    const response = await httpClient.get<AttendanceRecordApiResponse>(
      attendanceEndpoints.byDate(classId, date)
    );

    // Backend returns { success: true, data: {...} | null }
    if (response.success && response.data) {
      // Ensure data has required fields before mapping
      const data = response.data;
      if (!data || !data._id || !data.classId) {
        console.warn('Invalid attendance record data:', data);
        return null;
      }
      
      // Ensure students field exists and is an array
      if (!data.students) {
        data.students = [];
      }
      
      return mapAttendanceRecordApiToDomain(data);
    }

    return null;
  } catch (error: unknown) {
    // Return null for 404 (no attendance record found for date)
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      return null;
    }
    console.error('Error fetching attendance by date:', error);
    throw error;
  }
};

/**
 * Get attendance by lecture
 * GET /api/attendance/classes/:classId/attendance/lecture/:lectureId
 */
export const getAttendanceByLecture = async (
  classId: string,
  lectureId: string
): Promise<AttendanceRecord[]> => {
  try {
    const response = await httpClient.get<BackendSuccessResponse<AttendanceRecordApiDTO[]>>(
      attendanceEndpoints.byLecture(classId, lectureId)
    );

    // Backend returns { success: true, data: [...] }
    if (response.success && Array.isArray(response.data)) {
      return response.data.map(mapAttendanceRecordApiToDomain);
    }

    return [];
  } catch (error) {
    console.error('Error fetching attendance by lecture:', error);
    throw error;
  }
};

/**
 * Mark attendance (create)
 * POST /api/attendance/classes/:classId/attendance
 * Request body: { date, students: [{ studentId, status, remarks }], lectureId? }
 */
export const markAttendance = async (
  data: MarkAttendanceData
): Promise<AttendanceRecord> => {
  try {
    const payload = mapMarkAttendanceToDTO(data);
    
    // Validate payload before sending
    if (!payload.students || payload.students.length === 0) {
      throw new Error('No students in attendance data');
    }
    
    // Validate each student ID exists and is a non-empty string
    for (let i = 0; i < payload.students.length; i++) {
      const student = payload.students[i];
      if (!student || !student.studentId || typeof student.studentId !== 'string' || student.studentId.trim() === '') {
        throw new Error(`Student ${i + 1}: Student ID is required and must be a non-empty string`);
      }
      // Trim the studentId to remove any whitespace
      student.studentId = student.studentId.trim();
      
      // Validate MongoDB ObjectId format (24 hex characters)
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(student.studentId)) {
        throw new Error(`Student ${i + 1}: Student ID must be a valid MongoDB ObjectId (24 hex characters)`);
      }
    }
    console.log({payload});
    const response = await httpClient.post<MarkAttendanceApiResponse>(
      attendanceEndpoints.mark(data.classId),
      payload
    );

    // Backend returns { success: true, data: {...}, message?: "..." }
    if (response.success && response.data) {
      return mapAttendanceRecordApiToDomain(response.data);
    }

    throw new Error('Invalid API response: missing data');
  } catch (error: unknown) {
    // Handle specific error codes with backend error format
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status: number; message: string; details?: Array<{ field: string; message: string }> };
      
      if (apiError.status === 409) {
        throw new Error('Attendance already exists for this date');
      }
      if (apiError.status === 422) {
        // Use validation details if available
        if (apiError.details && apiError.details.length > 0) {
          const detailsMessage = apiError.details.map(d => `${d.field}: ${d.message}`).join(', ');
          throw new Error(`Validation error: ${detailsMessage}`);
        }
        throw new Error(apiError.message || 'Validation error: Please check your input');
      }
    }
    console.error('Error marking attendance:', error);
    throw error;
  }
};

/**
 * Update attendance record
 * PUT /api/attendance/classes/:classId/attendance/:recordId
 * Request body: { students: [{ studentId, status, remarks }], version? }
 */
export const updateAttendance = async (
  data: UpdateAttendanceData
): Promise<AttendanceRecord> => {
  try {
    const { recordId, classId, version, ...updateData } = data;
    // mapUpdateAttendanceToDTO expects partial data without recordId and classId
    // We destructured recordId and classId, so updateData is Partial<MarkAttendanceData>
    const payload = mapUpdateAttendanceToDTO({
      ...updateData,
      recordId: '', // Dummy value, not used by mapper
      classId: '', // Dummy value, not used by mapper
    } as UpdateAttendanceData);

    // Include version for optimistic locking
    if (version !== undefined) {
      (payload as Record<string, unknown>).version = version;
    }

    const response = await httpClient.put<MarkAttendanceApiResponse>(
      attendanceEndpoints.update(classId, recordId),
      payload
    );

    // Backend returns { success: true, data: {...}, message?: "..." }
    if (response.success && response.data) {
      return mapAttendanceRecordApiToDomain(response.data);
    }

    throw new Error('Invalid API response: missing data');
  } catch (error: unknown) {
    // Handle specific error codes with backend error format
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status: number; message: string; details?: Array<{ field: string; message: string }> };
      
      if (apiError.status === 409) {
        throw new Error('Record has been updated. Please refresh and try again');
      }
      if (apiError.status === 403) {
        throw new Error('This record is locked and cannot be modified');
      }
      if (apiError.status === 422) {
        // Use validation details if available
        if (apiError.details && apiError.details.length > 0) {
          const detailsMessage = apiError.details.map(d => `${d.field}: ${d.message}`).join(', ');
          throw new Error(`Validation error: ${detailsMessage}`);
        }
        throw new Error(apiError.message || 'Validation error: Please check your input');
      }
    }
    console.error('Error updating attendance:', error);
    throw error;
  }
};

/**
 * Delete attendance record
 * DELETE /api/attendance/classes/:classId/attendance/:recordId
 */
export const deleteAttendance = async (
  classId: string,
  recordId: string
): Promise<void> => {
  try {
    await httpClient.delete<BackendSuccessResponse<{ message?: string }> | void>(
      attendanceEndpoints.delete(classId, recordId)
    );
  } catch (error: unknown) {
    // Handle specific error codes with backend error format
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status: number; message: string };
      
      if (apiError.status === 403) {
        throw new Error('You cannot delete this attendance record');
      }
      if (apiError.status === 404) {
        throw new Error('Attendance record not found');
      }
    }
    console.error('Error deleting attendance record:', error);
    throw error;
  }
};

/**
 * Get class attendance statistics
 * GET /api/attendance/classes/:classId/statistics
 * Query params: startDate, endDate
 */
export const getAttendanceStatistics = async (
  classId: string,
  params?: StatisticsQueryParams
): Promise<AttendanceStatistics> => {
  try {
    const queryString = params ? buildQueryString(params as Record<string, unknown>) : '';
    const endpoint = queryString
      ? `${attendanceEndpoints.statistics(classId)}?${queryString}`
      : attendanceEndpoints.statistics(classId);

    const response = await httpClient.get<AttendanceStatisticsApiResponse>(endpoint);
    
    // Backend returns { success: true, data: {...} }
    if (response.success && response.data) {
      return mapAttendanceStatisticsApiResponse(response);
    }
    
    throw new Error('Invalid API response: missing data');
  } catch (error) {
    console.error('Error fetching attendance statistics:', error);
    throw error;
  }
};

/**
 * Get class attendance statistics (teacher endpoint)
 * GET /api/teacher/attendance/statistics/:classId
 * Query params: startDate, endDate
 */
export const getTeacherAttendanceStatistics = async (
  classId: string,
  params?: StatisticsQueryParams
): Promise<AttendanceStatistics> => {
  try {
    const queryString = params ? buildQueryString(params as Record<string, unknown>) : '';
    const endpoint = queryString
      ? `${attendanceEndpoints.teacherStatistics(classId)}?${queryString}`
      : attendanceEndpoints.teacherStatistics(classId);

    const response = await httpClient.get<AttendanceStatisticsApiResponse>(endpoint);
    
    // Backend returns { success: true, data: {...} }
    if (response.success && response.data) {
      return mapAttendanceStatisticsApiResponse(response);
    }
    
    throw new Error('Invalid API response: missing data');
  } catch (error) {
    console.error('Error fetching teacher attendance statistics:', error);
    throw error;
  }
};

/**
 * Get student attendance history
 * GET /api/attendance/students/:studentId
 * Query params: classId, startDate, endDate, page, limit
 */
export const getStudentAttendanceHistory = async (
  studentId: string,
  params?: StudentHistoryQueryParams
): Promise<StudentAttendanceHistory> => {
  try {
    const queryString = params ? buildQueryString(params as Record<string, unknown>) : '';
    const endpoint = queryString
      ? `${attendanceEndpoints.studentHistory(studentId)}?${queryString}`
      : attendanceEndpoints.studentHistory(studentId);

    const response = await httpClient.get<StudentAttendanceHistoryApiResponse>(endpoint);
    
    // Backend returns { success: true, data: {...} }
    if (response.success && response.data) {
      return mapStudentAttendanceHistoryApiResponse(response);
    }
    
    throw new Error('Invalid API response: missing data');
  } catch (error) {
    console.error('Error fetching student attendance history:', error);
    throw error;
  }
};

/**
 * Export attendance records
 * GET /api/admin/attendance/export
 * Query params: startDate (required), endDate (required), format (excel/csv), classId (optional)
 */
export const exportAttendance = async (
  params: ExportQueryParams
): Promise<Blob> => {
  try {
    // Validate required params
    if (!params.startDate || !params.endDate) {
      throw new Error('startDate and endDate are required for export');
    }

    const queryString = buildQueryString(params as unknown as Record<string, unknown>);
    const endpoint = `${attendanceEndpoints.export}?${queryString}`;

    // Use apiClient directly for blob response (axios supports responseType: 'blob')
    const response = await apiClient.get(endpoint, {
      responseType: 'blob',
    });

    return response.data as Blob;
  } catch (error) {
    console.error('Error exporting attendance:', error);
    throw error;
  }
};

/**
 * Export class statistics
 * GET /api/admin/attendance/export/statistics/:classId
 * Query params: startDate (required), endDate (required), format (excel/csv)
 */
export const exportAttendanceStatistics = async (
  classId: string,
  params: Omit<ExportQueryParams, 'classId'>
): Promise<Blob> => {
  try {
    // Validate required params
    if (!params.startDate || !params.endDate) {
      throw new Error('startDate and endDate are required for export');
    }

    const queryString = buildQueryString(params);
    const endpoint = `${attendanceEndpoints.exportStatistics(classId)}?${queryString}`;

    // Use apiClient directly for blob response
    const response = await apiClient.get(endpoint, {
      responseType: 'blob',
    });

    return response.data as Blob;
  } catch (error) {
    console.error('Error exporting attendance statistics:', error);
    throw error;
  }
};

/**
 * Attendance API service object
 */
export const attendanceApi = {
  getDashboard: getAttendanceDashboard,
  getRecords: getAttendanceRecords,
  getByDate: getAttendanceByDate,
  getByLecture: getAttendanceByLecture,
  mark: markAttendance,
  update: updateAttendance,
  delete: deleteAttendance,
  getStatistics: getAttendanceStatistics,
  getTeacherStatistics: getTeacherAttendanceStatistics,
  getStudentHistory: getStudentAttendanceHistory,
  export: exportAttendance,
  exportStatistics: exportAttendanceStatistics,
};

