/**
 * AttendancePageSkeleton Component
 * Skeleton for attendance page with form/table layout
 */

import { SkeletonBox } from './SkeletonBox';
import { SkeletonText } from './SkeletonText';
import { SkeletonTable } from './SkeletonTable';

interface AttendancePageSkeletonProps {
  className?: string;
}

export const AttendancePageSkeleton = ({ className = '' }: AttendancePageSkeletonProps) => {
  return (
    <div className={`space-y-6 ${className}`} role="status" aria-label="Loading attendance page..." aria-live="polite">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <SkeletonText width="12rem" height="1.75rem" className="mb-2" />
          <SkeletonText width="20rem" height="0.875rem" />
        </div>
        <SkeletonBox width="10rem" height="2.5rem" rounded="md" />
      </div>

      {/* Filters/Controls */}
      <div className="flex flex-wrap gap-4">
        <SkeletonBox width="12rem" height="2.5rem" rounded="md" />
        <SkeletonBox width="12rem" height="2.5rem" rounded="md" />
        <SkeletonBox width="8rem" height="2.5rem" rounded="md" />
      </div>

      {/* Table */}
      <SkeletonTable rows={10} columns={6} showHeader />
    </div>
  );
};
