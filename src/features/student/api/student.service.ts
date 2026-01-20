/**
 * Student Service
 */

import { httpClient } from '../../../services/http/httpClient';
import { API_ENDPOINTS } from '../../../services/endpoints';
import { StudentMapper } from './student.mapper';
import type {
  Exam,
  Notification,
  AcademicRecord,
  Teacher,
} from '../models/student.model';
import type {
  ExamDTO,
  NotificationDTO,
  AcademicRecordDTO,
  TeacherDTO,
} from './student.dto';

export const studentService = {
  // Exams
  getExams: async (params?: { status?: string; limit?: number }): Promise<Exam[]> => {
    const response = await httpClient.get<ExamDTO[] | { success: boolean; data: ExamDTO[] }>(
      API_ENDPOINTS.STUDENT_EXAMS,
      params
    );
    // Handle both wrapped and direct array responses
    const exams = Array.isArray(response) ? response : response.data || [];
    return exams.map(StudentMapper.examToDomain);
  },

  getExam: async (id: string): Promise<Exam> => {
    const response = await httpClient.get<ExamDTO>(
      `${API_ENDPOINTS.STUDENT_EXAMS}/${id}`
    );
    return StudentMapper.examToDomain(response);
  },

  // Notifications
  getNotifications: async (params?: { limit?: number }): Promise<Notification[]> => {
    const response = await httpClient.get<NotificationDTO[] | { success: boolean; data: NotificationDTO[] }>(
      API_ENDPOINTS.STUDENT_NOTIFICATIONS,
      params
    );
    // Handle both wrapped and direct array responses
    const notifications = Array.isArray(response) ? response : response.data || [];
    return notifications.map(StudentMapper.notificationToDomain);
  },

  markNotificationAsRead: async (id: string): Promise<void> => {
    await httpClient.patch(`${API_ENDPOINTS.STUDENT_NOTIFICATIONS}/${id}/read`);
  },

  // Academic Records
  getAcademicRecords: async (): Promise<AcademicRecord[]> => {
    const response = await httpClient.get<AcademicRecordDTO[]>(
      API_ENDPOINTS.STUDENT_RECORDS
    );
    return response.map(StudentMapper.academicRecordToDomain);
  },

  // Teachers
  getTeachers: async (): Promise<Teacher[]> => {
    const response = await httpClient.get<TeacherDTO[]>(
      API_ENDPOINTS.STUDENT_TEACHERS
    );
    return response.map(StudentMapper.teacherToDomain);
  },
};


