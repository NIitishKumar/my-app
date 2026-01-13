/**
 * SkeletonAvatar Component
 * Circular avatar skeleton
 */

interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SkeletonAvatar = ({ size = 'md', className = '' }: SkeletonAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size];

  return (
    <div
      className={`bg-gray-200 animate-pulse rounded-full ${sizeClasses} ${className}`}
      role="status"
      aria-label="Loading avatar..."
      aria-live="polite"
    />
  );
};
