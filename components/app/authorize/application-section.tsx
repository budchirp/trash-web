import type React from 'react'

import { ApplicationIcon } from '@/components/app/developers/application-icon'

import { Column, Heading, Row, Text } from '@trash-kit/ui'

import type { Application } from '@/types/api/application'

type ApplicationSectionProps = {
  application: Application

  children?: React.ReactNode
}

export const ApplicationSection: React.FC<ApplicationSectionProps> = ({
  application,
  children
}) => {
  return (
    <Row className='w-full gap-3'>
      <ApplicationIcon application={application} className='size-12' color='primary' />

      <Column className='grow'>
        <Heading size='h3'>{application?.name}</Heading>
        <Text className='text-content-tertiary'>{application?.description}</Text>
      </Column>

      {children}
    </Row>
  )
}
