/**
 * RecentActivitySkeleton Component
 * Skeleton for recent activity feed
 */

import { SkeletonAvatar } from '../SkeletonAvatar';
import { SkeletonText } from '../SkeletonText';

interface RecentActivitySkeletonProps {
  items?: number;
  className?: string;
}

export const RecentActivitySkeleton = ({ items = 5, className = '' }: RecentActivitySkeletonProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200 ${className}`} role="status" aria-label="Loading recent activity..." aria-live="polite">
      {Array.from({ length: items }).map((_, index) => (
        <div key={`activity-${index}`} className="p-4 flex items-start space-x-4">
          <SkeletonAvatar size="md" />
          <div className="flex-1 min-w-0 space-y-2">
            <SkeletonText width="80%" height="1rem" />
            <SkeletonText width="60%" height="0.875rem" />
            <SkeletonText width="40%" height="0.75rem" />
          </div>
        </div>
      ))}
    </div>
  );
};
