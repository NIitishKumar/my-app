/**
 * Teacher Classes API Endpoints
 */

export const teacherClassesEndpoints = {
  base: '/teacher/classes',
  list: () => '/teacher/classes',
  detail: (classId: string) => `/teacher/classes/${classId}`,
} as const;

