/**
 * SkeletonBox Component
 * Base component for rectangular box skeletons
 */

interface SkeletonBoxProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export const SkeletonBox = ({ 
  className = '', 
  width,
  height,
  rounded = 'md'
}: SkeletonBoxProps) => {
  const roundedClass = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded];

  return (
    <div
      className={`bg-gray-200 animate-pulse ${roundedClass} ${className}`}
      style={{ width, height }}
      role="status"
      aria-label="Loading..."
      aria-live="polite"
    />
  );
};
