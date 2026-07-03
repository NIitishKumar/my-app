/**
 * Classes API Endpoints
 */

export const classesEndpoints = {
  base: '/classes',
  list: () => '/classes',
  detail: (id: string) => `/classes/${id}`,
  create: () => '/classes',
  update: (id: string) => `/classes/${id}`,
  delete: (id: string) => `/classes/${id}`,
  // classes.endpoints.ts
  removeStudent: (classId: string) => `/classes/${classId}/remove-student`,
} as const;
