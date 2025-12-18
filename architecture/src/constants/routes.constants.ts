// Route path constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    CLASSES: '/admin/classes',
    TEACHERS: '/admin/teachers',
    STUDENTS: '/admin/students',
  },
  TEACHER: {
    DASHBOARD: '/teacher/dashboard',
    CLASSES: '/teacher/classes',
    ATTENDANCE: '/teacher/attendance',
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    CLASSES: '/student/classes',
    GRADES: '/student/grades',
  },
  PARENT: {
    DASHBOARD: '/parent/dashboard',
    CHILDREN: '/parent/children',
  },
} as const;

