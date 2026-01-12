/**
 * Subjects API Endpoints
 */

export const subjectsEndpoints = {
  base: '/admin/subjects',
  list: () => '/admin/subjects',
  detail: (id: string) => `/admin/subjects/${id}`,
  create: () => '/admin/subjects',
  update: (id: string) => `/admin/subjects/${id}`,
  delete: (id: string) => `/admin/subjects/${id}`,
} as const;

