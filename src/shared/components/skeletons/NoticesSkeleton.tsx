/**
 * NoticesSkeleton Component
 * Skeleton for notices/announcements list
 */

import { SkeletonBox } from './SkeletonBox';
import { SkeletonText } from './SkeletonText';

interface NoticesSkeletonProps {
  items?: number;
  className?: string;
}

export const NoticesSkeleton = ({ items = 5, className = '' }: NoticesSkeletonProps) => {
  return (
    <div className={`space-y-4 ${className}`} role="status" aria-label="Loading notices..." aria-live="polite">
      {Array.from({ length: items }).map((_, index) => (
        <div key={`notice-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <SkeletonText width="60%" height="1.25rem" className="mb-2" />
              <SkeletonText width="40%" height="0.875rem" />
            </div>
            <SkeletonBox width="5rem" height="1.5rem" rounded="full" />
          </div>
          <SkeletonText width="100%" height="1rem" className="mb-2" />
          <SkeletonText width="80%" height="1rem" className="mb-3" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SkeletonText width="6rem" height="0.875rem" />
              <SkeletonText width="6rem" height="0.875rem" />
            </div>
            <SkeletonBox width="5rem" height="2rem" rounded="md" />
          </div>
        </div>
      ))}
    </div>
  );
};
