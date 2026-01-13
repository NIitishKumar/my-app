/**
 * SkeletonTable Component
 * Skeleton for tables with multiple rows and columns
 */

import { SkeletonText } from './SkeletonText';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

export const SkeletonTable = ({ 
  rows = 5, 
  columns = 4,
  showHeader = true,
  className = '' 
}: SkeletonTableProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`} role="status" aria-label="Loading table..." aria-live="polite">
      {showHeader && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-3">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <SkeletonText key={`header-${i}`} width="60%" height="0.875rem" />
            ))}
          </div>
        </div>
      )}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="px-4 sm:px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <SkeletonText 
                  key={`cell-${rowIndex}-${colIndex}`} 
                  width={colIndex === 0 ? '80%' : '60%'} 
                  height="1rem" 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
