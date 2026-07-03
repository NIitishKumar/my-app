/**
 * Dashboard API Endpoints
 */

export const dashboardEndpoints = {
  base: '/dashboard',
  quick: () => '/dashboard/quick',
  stats: () => '/dashboard/stats',
} as const;

