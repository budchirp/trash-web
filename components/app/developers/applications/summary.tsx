import type React from 'react'

import { Boxes } from 'lucide-react'
import { Column, Heading, IconBox, Row, Text, cn } from '@trash-kit/ui'

import type { Application } from '@/types/api/application'

type ApplicationSummaryProps = {
  application: Pick<Application, 'icon' | 'name' | 'description'>

  className?: string
  children?: React.ReactNode
}

export const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
  application,
  className,
  children
}: ApplicationSummaryProps): React.ReactNode => (
  <Row className={cn('w-full gap-3', className)}>
    <IconBox className='overflow-hidden' color='secondary' size='lg'>
      {application.icon ? (
        <img src={application.icon} alt={application.name} className='size-full object-cover' />
      ) : (
        <Boxes className='text-content-tertiary' />
      )}
    </IconBox>

    <Column className='grow'>
      <Heading size='h3'>{application.name}</Heading>
      <Text className='text-content-tertiary'>{application.description}</Text>
    </Column>

    {children}
  </Row>
)
