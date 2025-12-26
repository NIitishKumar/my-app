/**
 * Students API Endpoints
 */

export const studentsEndpoints = {
  base: '/admin/students',
  list: () => '/admin/students',
  detail: (id: string) => `/admin/students/${id}`,
  create: () => '/admin/students',
  update: (id: string) => `/admin/students/${id}`,
  delete: (id: string) => `/admin/students/${id}`,
} as const;

