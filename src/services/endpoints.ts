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
  ADMIN_REPORTS: '/admin/reports',
  
  // Teacher
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
  
  // Parent
  PARENT_CHILDREN: '/parent/children',
  PARENT_ATTENDANCE: '/parent/attendance',
  PARENT_RECORDS: '/parent/records',
  PARENT_TEACHERS: '/parent/teachers',
  PARENT_QUERIES: '/parent/queries',
} as const;

