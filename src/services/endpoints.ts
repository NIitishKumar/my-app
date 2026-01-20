export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  
  // Admin
  ADMIN_DASHBOARD: '/dashboard',
  ADMIN_CLASSES: '/admin/classes',
  ADMIN_TEACHERS: '/admin/teachers',
  ADMIN_LECTURES: '/admin/lectures',
  ADMIN_SUBJECTS: '/admin/subjects',
  ADMIN_NOTICES: '/admin/notices',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_EXAMS: '/admin/exams',
  
  // Teacher
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_CLASSES: '/teacher/classes',
  TEACHER_ATTENDANCE: '/teacher/attendance',
  TEACHER_EXAMS: '/teacher/exams',
  TEACHER_QUERIES: '/teacher/queries',
  
  // Subjects (for teachers, students, parents - view only)
  SUBJECTS: '/subjects',
  
  // Student
  STUDENT_EXAMS: '/student/exams',
  STUDENT_EXAMS_UPCOMING: '/student/exams/upcoming',
  STUDENT_EXAMS_RESULTS: '/student/exams/results',
  STUDENT_EXAMS_CALENDAR: '/student/exams/calendar',
  STUDENT_EXAMS_EXPORT: '/student/exams/export',
  STUDENT_NOTIFICATIONS: '/student/notifications',
  STUDENT_RECORDS: '/student/records',
  STUDENT_TEACHERS: '/student/teachers',
  // Student Dashboard
  STUDENT_DASHBOARD_STATS: '/student/dashboard/stats',
  STUDENT_DASHBOARD_ATTENDANCE: '/student/dashboard/attendance',
  STUDENT_DASHBOARD_ACADEMIC_SUMMARY: '/student/dashboard/academic-summary',
  STUDENT_DASHBOARD_SCHEDULE_TODAY: '/student/dashboard/schedule/today',
  // Student Timetable
  STUDENT_TIMETABLE: '/student/timetable',
  STUDENT_TIMETABLE_WEEK: '/student/timetable/week',
  STUDENT_TIMETABLE_DAY: '/student/timetable/day',
  // Student Attendance
  STUDENT_ATTENDANCE: '/student/attendance',
  
  // Parent
  PARENT_CHILDREN: '/parent/children',
  PARENT_ATTENDANCE: '/parent/attendance',
  PARENT_ATTENDANCE_OVERVIEW: '/parent/attendance/overview',
  PARENT_ATTENDANCE_COMPARE: '/parent/attendance/compare',
  PARENT_RECORDS: '/parent/records',
  PARENT_TEACHERS: '/parent/teachers',
  PARENT_QUERIES: '/parent/queries',
  
  // Profile (shared across all roles)
  USER_PROFILE: '/users/profile',
  USER_PROFILE_AVATAR: '/users/profile/avatar',
  USER_PASSWORD: '/users/password',
} as const;

