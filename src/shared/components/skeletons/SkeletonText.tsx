/**
 * SkeletonText Component
 * Base component for text line skeletons with shimmer effect
 */

interface SkeletonTextProps {
  className?: string;
  width?: string;
  height?: string;
}

export const SkeletonText = ({ 
  className = '', 
  width = '100%', 
  height = '1rem' 
}: SkeletonTextProps) => {
  return (
    <div
      className={`bg-gray-200 animate-pulse rounded ${className}`}
      style={{ width, height }}
      role="status"
      aria-label="Loading..."
      aria-live="polite"
    />
  );
};
