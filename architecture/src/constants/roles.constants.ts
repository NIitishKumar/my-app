// User roles enum
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

