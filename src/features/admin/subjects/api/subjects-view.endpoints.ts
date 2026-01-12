/**
 * Subjects API Endpoints - For view-only access (teachers, students, parents)
 */

export const subjectsViewEndpoints = {
  base: '/subjects',
  list: () => '/subjects',
  detail: (id: string) => `/subjects/${id}`,
} as const;

