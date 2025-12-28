/**
 * Lectures API Endpoints
 */

export const lecturesEndpoints = {
  base: '/lectures',
  list: () => '/lectures',
  detail: (id: string) => `/lectures/${id}`,
  create: () => '/lectures',
  update: (id: string) => `/lectures/${id}`,
  delete: (id: string) => `/lectures/${id}`,
} as const;

