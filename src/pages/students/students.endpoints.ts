/**
 * Students API Endpoints
 */

export const studentsEndpoints = {
  base: '/students',
  list: () => '/students',
  detail: (id: string) => `/students/${id}`,
  create: () => '/students',
  update: (id: string) => `/students/${id}`,
  delete: (id: string) => `/students/${id}`,
} as const;

