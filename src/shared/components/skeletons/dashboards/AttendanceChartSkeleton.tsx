/**
 * AttendanceChartSkeleton Component
 * Skeleton for attendance chart/statistics
 */

import { SkeletonBox } from '../SkeletonBox';
import { SkeletonText } from '../SkeletonText';

interface AttendanceChartSkeletonProps {
  className?: string;
}

export const AttendanceChartSkeleton = ({ className = '' }: AttendanceChartSkeletonProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 ${className}`} role="status" aria-label="Loading attendance chart..." aria-live="polite">
      <SkeletonText width="40%" height="1.25rem" className="mb-4" />
      <SkeletonBox width="100%" height="12rem" rounded="md" className="mb-4" />
      <div className="flex justify-between">
        <SkeletonText width="20%" height="0.875rem" />
        <SkeletonText width="20%" height="0.875rem" />
        <SkeletonText width="20%" height="0.875rem" />
      </div>
    </div>
  );
};
