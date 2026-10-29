import { UserIcon } from 'lucide-react'
import { cn } from '@trash-kit/ui'

type ProfileAvatarProps = {
  name?: string | null
  src?: string | null
  className?: string
}

// Original avatar rendering from 1eebf7b, shared by editable and display-only avatars.
export const ProfileAvatar = ({ name, src, className = 'size-12' }: ProfileAvatarProps) => {
  const parts = name?.trim().split(/\s+/) ?? []
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : (name?.trim().slice(0, 2).toUpperCase() ?? '')

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full overflow-hidden shrink-0 border border-outline aspect-square bg-surface-secondary',
        src ? 'p-0' : 'p-1',
        className
      )}
    >
      {src ? (
        <img src={src} alt={name ?? ''} className='size-full rounded-full object-cover' />
      ) : initials ? (
        <span
          role='img'
          aria-label={name ?? ''}
          className='font-bold uppercase select-none text-content-primary tracking-wider text-sm md:text-base'
        >
          {initials}
        </span>
      ) : (
        <UserIcon aria-label={name ?? ''} className='size-1/2 text-content-tertiary' />
      )}
    </div>
  )
}
