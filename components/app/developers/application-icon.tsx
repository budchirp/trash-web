import type React from 'react'

import { IconBox, type IconBoxProps } from '@/components/icon-box'

import { Boxes } from 'lucide-react'

import { cn } from '@trash-kit/ui'

import type { Application } from '@/types/api/application'

type ApplicationIconProps = {
  application: Pick<Application, 'icon' | 'name'>

  className?: string
  color?: IconBoxProps['color']
}

export const ApplicationIcon: React.FC<ApplicationIconProps> = ({
  application,

  className = 'size-12',
  color = 'secondary'
}: ApplicationIconProps): React.ReactNode => (
  <IconBox
    className={cn(application.icon ? 'p-0' : 'p-1', className)}
    color={color}
    icon={
      application.icon ? (
        <img
          src={application.icon}
          alt={application.name}
          className='size-full rounded-2xl object-cover'
        />
      ) : (
        <Boxes className='size-1/2 text-content-tertiary' />
      )
    }
  />
)
