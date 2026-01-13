/**
 * StudentListSkeleton Component
 * Skeleton for student list/table with search and pagination
 */

import { SkeletonBox } from './SkeletonBox';
import { SkeletonTable } from './SkeletonTable';
import { SkeletonText } from './SkeletonText';

interface StudentListSkeletonProps {
  className?: string;
}

export const StudentListSkeleton = ({ className = '' }: StudentListSkeletonProps) => {
  return (
    <div className={`space-y-4 ${className}`} role="status" aria-label="Loading student list..." aria-live="polite">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SkeletonBox width="100%" height="2.5rem" rounded="md" className="sm:max-w-md" />
        <div className="flex gap-2">
          <SkeletonBox width="6rem" height="2.5rem" rounded="md" />
          <SkeletonBox width="6rem" height="2.5rem" rounded="md" />
        </div>
      </div>

      {/* Table */}
      <SkeletonTable rows={8} columns={5} showHeader />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <SkeletonText width="8rem" height="1rem" />
        <div className="flex gap-2">
          <SkeletonBox width="2.5rem" height="2.5rem" rounded="md" />
          <SkeletonBox width="2.5rem" height="2.5rem" rounded="md" />
          <SkeletonBox width="2.5rem" height="2.5rem" rounded="md" />
          <SkeletonBox width="2.5rem" height="2.5rem" rounded="md" />
        </div>
      </div>
    </div>
  );
};
