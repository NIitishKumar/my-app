export const USER_ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROUTES = {
  LOGIN: '/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CLASSES: '/admin/classes',
  ADMIN_TEACHERS: '/admin/teachers',
  ADMIN_LECTURES: '/admin/lectures',
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_ATTENDANCE: '/teacher/attendance',
  TEACHER_QUERIES: '/teacher/queries',
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_EXAMS: '/student/exams',
  STUDENT_NOTIFICATIONS: '/student/notifications',
  STUDENT_RECORDS: '/student/records',
  PARENT_DASHBOARD: '/parent/dashboard',
  PARENT_ATTENDANCE: '/parent/attendance',
  PARENT_RECORDS: '/parent/records',
} as const;

