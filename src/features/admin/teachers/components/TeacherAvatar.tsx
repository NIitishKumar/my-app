/**
 * TeacherAvatar Component
 */

import { getTeacherInitials, getTeacherAvatarColor } from '../utils/teachers.utils';

interface TeacherAvatarProps {
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TeacherAvatar = ({ firstName, lastName, size = 'md' }: TeacherAvatarProps) => {
  const initials = getTeacherInitials(firstName, lastName);
  const colorClass = getTeacherAvatarColor(initials);
  
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

