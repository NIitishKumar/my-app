/**
 * Classes API Endpoints
 */

export const classesEndpoints = {
  base: '/admin/classes',
  list: () => '/admin/classes',
  detail: (id: string) => `/admin/classes/${id}`,
  create: () => '/admin/classes',
  update: (id: string) => `/admin/classes/${id}`,
  delete: (id: string) => `/admin/classes/${id}`,
} as const;


