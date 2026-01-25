import { Center, cn } from '@trash-kit/ui'
import type React from 'react'

interface IconBoxProps {
  className?: string
  color?: 'accent' | 'primary' | 'secondary'
  icon: React.ReactNode
}

export const IconBox: React.FC<IconBoxProps> = ({
  className = 'size-16',
  color = 'primary',
  icon
}: IconBoxProps): React.ReactNode => {
  return (
    <Center
      className={cn(
        'rounded-full overflow-hidden shrink-0 border border-outline aspect-square p-2',
        color === 'accent' && 'bg-surface-accent',
        color === 'primary' && 'bg-surface-primary',
        color === 'secondary' && 'bg-surface-secondary',
        className
      )}
    >
      {icon}
    </Center>
  )
}
