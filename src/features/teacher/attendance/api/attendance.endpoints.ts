/**
 * Teacher Attendance API Endpoints
 * Following backend API specification exactly
 */

export const attendanceEndpoints = {
  // ============================================
  // Teacher Attendance Routes (/api/teacher)
  // ============================================
  
  /**
   * GET /api/teacher/attendance/dashboard
   * Get teacher's attendance dashboard
   */
  dashboard: '/teacher/attendance/dashboard',
  
  /**
   * GET /api/teacher/attendance
   * Get teacher's attendance records with filters and pagination
   * Query params: classId, startDate, endDate, lectureId, status, page, limit
   */
  list: '/teacher/attendance',
  
  /**
   * GET /api/teacher/attendance/statistics/:classId
   * Get class statistics (teacher)
   * Query params: startDate, endDate
   */
  teacherStatistics: (classId: string) => 
    `/teacher/attendance/statistics/${classId}`,
  
  // ============================================
  // Core Attendance Routes (/api/attendance)
  // ============================================
  
  /**
   * GET /api/attendance/classes/:classId/attendance
   * Get all attendance for a class
   * Query params: startDate, endDate, lectureId, status, page, limit
   */
  getByClass: (classId: string) => 
    `/attendance/classes/${classId}/attendance`,
  
  /**
   * GET /api/attendance/classes/:classId/attendance/date/:date
   * Get attendance for specific date
   */
  byDate: (classId: string, date: string) => 
    `/attendance/classes/${classId}/attendance/date/${date}`,
  
  /**
   * GET /api/attendance/classes/:classId/attendance/lecture/:lectureId
   * Get attendance for specific lecture
   */
  byLecture: (classId: string, lectureId: string) => 
    `/attendance/classes/${classId}/attendance/lecture/${lectureId}`,
  
  /**
   * POST /api/attendance/classes/:classId/attendance
   * Create attendance record
   */
  mark: (classId: string) => 
    `/attendance/classes/${classId}/attendance`,
  
  /**
   * PUT /api/attendance/classes/:classId/attendance/:recordId
   * Update attendance record
   */
  update: (classId: string, recordId: string) => 
    `/attendance/classes/${classId}/attendance/${recordId}`,
  
  /**
   * DELETE /api/attendance/classes/:classId/attendance/:recordId
   * Delete attendance record
   */
  delete: (classId: string, recordId: string) => 
    `/attendance/classes/${classId}/attendance/${recordId}`,
  
  // ============================================
  // Statistics Routes (/api/attendance)
  // ============================================
  
  /**
   * GET /api/attendance/classes/:classId/statistics
   * Get class attendance statistics
   * Query params: startDate, endDate
   */
  statistics: (classId: string) => 
    `/attendance/classes/${classId}/statistics`,
  
  /**
   * GET /api/attendance/students/:studentId
   * Get student attendance history
   * Query params: classId, startDate, endDate, page, limit
   */
  studentHistory: (studentId: string) => 
    `/attendance/students/${studentId}`,
  
  /**
   * GET /api/attendance/reports/daily
   * Get daily attendance report
   * Query params: startDate, endDate, classId
   */
  dailyReport: '/attendance/reports/daily',
  
  /**
   * GET /api/attendance/reports/trends
   * Get attendance trends
   * Query params: classId, startDate, endDate, period
   */
  trendsReport: '/attendance/reports/trends',
  
  // ============================================
  // Export Routes (/api/admin)
  // ============================================
  
  /**
   * GET /api/admin/attendance/export
   * Export attendance report (Excel/CSV)
   * Query params: startDate (required), endDate (required), format (excel/csv), classId (optional)
   */
  export: '/admin/attendance/export',
  
  /**
   * GET /api/admin/attendance/export/statistics/:classId
   * Export class statistics
   * Query params: startDate (required), endDate (required), format (excel/csv)
   */
  exportStatistics: (classId: string) => 
    `/admin/attendance/export/statistics/${classId}`,
} as const;

