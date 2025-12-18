/**
 * Teachers API Endpoints
 */

export const teachersEndpoints = {
  base: '/admin/teachers',
  list: () => '/admin/teachers',
  detail: (id: string) => `/admin/teachers/${id}`,
  create: () => '/admin/teachers',
  update: (id: string) => `/admin/teachers/${id}`,
  delete: (id: string) => `/admin/teachers/${id}`,
} as const;


