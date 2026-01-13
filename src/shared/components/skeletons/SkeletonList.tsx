/**
 * SkeletonList Component
 * Skeleton for lists with avatar, title, and subtitle
 */

import { SkeletonAvatar } from './SkeletonAvatar';
import { SkeletonText } from './SkeletonText';

interface SkeletonListProps {
  items?: number;
  showAvatar?: boolean;
  className?: string;
}

export const SkeletonList = ({ 
  items = 5, 
  showAvatar = true,
  className = '' 
}: SkeletonListProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200 ${className}`} role="status" aria-label="Loading list..." aria-live="polite">
      {Array.from({ length: items }).map((_, index) => (
        <div key={`item-${index}`} className="p-4 flex items-center space-x-4">
          {showAvatar && <SkeletonAvatar size="md" />}
          <div className="flex-1 min-w-0 space-y-2">
            <SkeletonText width="70%" height="1rem" />
            <SkeletonText width="50%" height="0.875rem" />
          </div>
        </div>
      ))}
    </div>
  );
};
