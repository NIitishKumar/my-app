/**
 * StudentAvatar Component
 */

import { getStudentInitials, getStudentAvatarColor } from '../utils/students.utils';

interface StudentAvatarProps {
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StudentAvatar = ({ firstName, lastName, size = 'md' }: StudentAvatarProps) => {
  const initials = getStudentInitials(firstName, lastName);
  const colorClass = getStudentAvatarColor(initials);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-semibold`}
    >
      {initials}
    </div>
  );
};

