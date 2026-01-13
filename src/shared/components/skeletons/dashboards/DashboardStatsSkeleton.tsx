/**
 * DashboardStatsSkeleton Component
 * Skeleton for dashboard stats grid
 */

import { SkeletonCard } from '../SkeletonCard';

interface DashboardStatsSkeletonProps {
  count?: number;
  className?: string;
}

export const DashboardStatsSkeleton = ({ count = 4, className = '' }: DashboardStatsSkeletonProps) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`} role="status" aria-label="Loading dashboard statistics..." aria-live="polite">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={`stat-${index}`} showIcon showDescription />
      ))}
    </div>
  );
};
