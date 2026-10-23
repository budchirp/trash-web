import type React from 'react'

import { Boxes } from 'lucide-react'

import { IconBox, cn } from '@trash-kit/ui'
import type { IconBoxProps } from '@trash-kit/ui'

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
  <IconBox className={cn('overflow-hidden', className)} color={color} size='lg'>
    {application.icon ? (
      <img src={application.icon} alt={application.name} className='size-full object-cover' />
    ) : (
      <Boxes className='text-content-tertiary' />
    )}
  </IconBox>
)
