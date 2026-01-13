/**
 * TodaysClassesSkeleton Component
 * Skeleton for today's classes list
 */

import { SkeletonBox } from '../SkeletonBox';
import { SkeletonText } from '../SkeletonText';

interface TodaysClassesSkeletonProps {
  items?: number;
  className?: string;
}

export const TodaysClassesSkeleton = ({ items = 3, className = '' }: TodaysClassesSkeletonProps) => {
  return (
    <div className={`space-y-4 ${className}`} role="status" aria-label="Loading today's classes..." aria-live="polite">
      {Array.from({ length: items }).map((_, index) => (
        <div key={`class-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-3">
              <SkeletonText width="60%" height="1.25rem" />
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <div className="flex items-center space-x-2">
                  <SkeletonBox width="1rem" height="1rem" rounded="full" />
                  <SkeletonText width="4rem" height="0.875rem" />
                </div>
                <div className="flex items-center space-x-2">
                  <SkeletonBox width="1rem" height="1rem" rounded="full" />
                  <SkeletonText width="5rem" height="0.875rem" />
                </div>
                <div className="flex items-center space-x-2">
                  <SkeletonBox width="1rem" height="1rem" rounded="full" />
                  <SkeletonText width="4rem" height="0.875rem" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 sm:flex-shrink-0">
              <SkeletonBox width="6rem" height="2.5rem" rounded="md" />
              <SkeletonBox width="6rem" height="2.5rem" rounded="md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
