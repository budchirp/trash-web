import type React from 'react'

import { IconBox } from '@/components/icon-box'

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
      <IconBox
        className='size-12 p-1'
        icon={
          <img
            className='rounded-full size-full object-cover'
            src={application?.icon}
            alt={application?.name}
          />
        }
      />

      <Column className='grow'>
        <Heading size='h3'>{application?.name}</Heading>
        <Text className='text-tertiary'>{application?.description}</Text>
      </Column>

      {children}
    </Row>
  )
}
