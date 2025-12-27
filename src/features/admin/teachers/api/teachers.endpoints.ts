/**
 * Teachers API Endpoints
 */

export const teachersEndpoints = {
  base: '/teachers',
  list: () => '/teachers',
  detail: (id: string) => `/teachers/${id}`,
  create: () => '/teachers',
  update: (id: string) => `/teachers/${id}`,
  delete: (id: string) => `/teachers/${id}`,
  hardDelete: (id: string) => `/teachers/${id}/hard`,
  byDepartment: (department: string) => `/teachers/department/${department}`,
  stats: () => '/teachers/stats',
  teacherWithClasses: (id: string) => `/teachers/${id}/classes`,
  addClass: (id: string) => `/teachers/${id}/classes`,
  removeClass: (id: string) => `/teachers/${id}/classes`,
} as const;


