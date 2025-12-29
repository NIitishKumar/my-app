/**
 * Attendance API Endpoints
 */

export const attendanceEndpoints = {
  base: (classId: string) => `/attendance/classes/${classId}/attendance`,
  list: (classId: string) => `/attendance/classes/${classId}/attendance`,
  byDate: (classId: string, date: string) => `/attendance/classes/${classId}/attendance/date/${date}`,
  byLecture: (classId: string, lectureId: string) => `/attendance/classes/${classId}/attendance/lecture/${lectureId}`,
  create: (classId: string) => `/attendance/classes/${classId}/attendance`,
  update: (classId: string, recordId: string) => `/attendance/classes/${classId}/attendance/${recordId}`,
  delete: (classId: string, recordId: string) => `/attendance/classes/${classId}/attendance/${recordId}`,
} as const;

