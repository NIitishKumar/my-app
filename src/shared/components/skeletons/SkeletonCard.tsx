/**
 * SkeletonCard Component
 * Skeleton for dashboard cards with icon, title, value, and description
 */

import { SkeletonBox } from './SkeletonBox';
import { SkeletonText } from './SkeletonText';

interface SkeletonCardProps {
  showIcon?: boolean;
  showDescription?: boolean;
  className?: string;
}

export const SkeletonCard = ({ 
  showIcon = true, 
  showDescription = true,
  className = '' 
}: SkeletonCardProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 ${className}`}
      role="status"
      aria-label="Loading card..."
      aria-live="polite"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <SkeletonText width="60%" height="0.875rem" className="mb-2" />
          <SkeletonText width="40%" height="2rem" className="mb-2" />
        </div>
        {showIcon && (
          <SkeletonBox width="3rem" height="3rem" rounded="lg" className="ml-4 flex-shrink-0" />
        )}
      </div>
      {showDescription && (
        <SkeletonText width="80%" height="0.75rem" />
      )}
    </div>
  );
};
