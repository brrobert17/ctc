import type { User } from '../../utils/auth'

interface ProfileIconProps {
  user: User
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function ProfileIcon({ user, size = 'md', className = '' }: ProfileIconProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg'
  }

  // Override size classes if custom className with size is provided
  const finalSizeClass = className.includes('w-') ? '' : sizeClasses[size]

  // Google account pictures
  if (user.provider === 'google' && user.profilePicture) {
    return (
      <div className="relative">
        <img
          src={user.profilePicture}
          alt={`${user.firstName} ${user.lastName}`}
          className={`${finalSizeClass} rounded-full object-cover border-2 border-slate-600 ${className}`}
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement
            const fallback = target.nextElementSibling as HTMLElement
            target.style.display = 'none'
            if (fallback) fallback.style.display = 'flex'
          }}
        />
        <div 
          className={`${finalSizeClass} rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-semibold ${textSizeClasses[size]} ${className}`}
          style={{ display: 'none' }}
        >
          {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()}
        </div>
      </div>
    )
  }

  // Default profile icon with user initials
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()

  return (
    <div className={`${finalSizeClass} rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-semibold ${textSizeClasses[size]} ${className}`}>
      {initials}
    </div>
  )
}
