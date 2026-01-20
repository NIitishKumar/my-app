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
  
  // Teacher
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_CLASSES: '/teacher/classes',
  TEACHER_ATTENDANCE: '/teacher/attendance',
  TEACHER_QUERIES: '/teacher/queries',
  
  // Subjects (for teachers, students, parents - view only)
  SUBJECTS: '/subjects',
  
  // Student
  STUDENT_EXAMS: '/student/exams',
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
  
  // Parent
  PARENT_CHILDREN: '/parent/children',
  PARENT_ATTENDANCE: '/parent/attendance',
  PARENT_RECORDS: '/parent/records',
  PARENT_TEACHERS: '/parent/teachers',
  PARENT_QUERIES: '/parent/queries',
  
  // Profile (shared across all roles)
  USER_PROFILE: '/users/profile',
  USER_PROFILE_AVATAR: '/users/profile/avatar',
  USER_PASSWORD: '/users/password',
} as const;

