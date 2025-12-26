/**
 * Lectures API Endpoints
 */

const BASE_PATH = '/api/admin/lectures';

export const lecturesEndpoints = {
  list: () => `${BASE_PATH}`,
  create: () => `${BASE_PATH}`,
  detail: (id: string) => `${BASE_PATH}/${id}`,
  update: (id: string) => `${BASE_PATH}/${id}`,
  delete: (id: string) => `${BASE_PATH}/${id}`,
} as const;

