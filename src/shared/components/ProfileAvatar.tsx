/**
 * ProfileAvatar Component
 * Shared component for displaying user profile pictures with initials fallback
 */

interface ProfileAvatarProps {
  src?: string | null;
  name?: string;
  firstName?: string;
  lastName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

/**
 * Get user initials from name or firstName/lastName
 */
const getInitials = (name?: string, firstName?: string, lastName?: string): string => {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }
  
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  
  if (firstName) {
    return firstName.charAt(0).toUpperCase();
  }
  
  return 'U';
};

/**
 * Get avatar color based on initials
 */
const getAvatarColor = (initials: string): string => {
  const colors = [
    'bg-purple-500',
    'bg-indigo-500',
    'bg-blue-500',
    'bg-cyan-500',
    'bg-teal-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-pink-500',
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

export const ProfileAvatar = ({
  src,
  name,
  firstName,
  lastName,
  size = 'md',
  className = '',
  onClick,
}: ProfileAvatarProps) => {
  const initials = getInitials(name, firstName, lastName);
  const colorClass = getAvatarColor(initials);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''} ${className}`;

  if (src) {
    return (
      <div
        className={baseClasses}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        } : undefined}
      >
        <img
          src={src}
          alt={name || `${firstName} ${lastName}`.trim() || 'User'}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `<span>${initials}</span>`;
              parent.className = `${baseClasses} ${colorClass}`;
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${colorClass}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      aria-label={name || `${firstName} ${lastName}`.trim() || 'User avatar'}
    >
      {initials}
    </div>
  );
};

