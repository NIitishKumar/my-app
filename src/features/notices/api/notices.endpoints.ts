/**
 * Notices API Endpoints
 */

export const noticesEndpoints = {
  base: '/admin/notices',
  list: () => '/admin/notices',
  detail: (id: string) => `/admin/notices/${id}`,
  create: () => '/admin/notices',
  update: (id: string) => `/admin/notices/${id}`,
  delete: (id: string) => `/admin/notices/${id}`,
} as const;
