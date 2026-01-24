'use client'

import type React from 'react'

import { Column, Row, Section, Tag } from '@trash-kit/ui'
import { useTranslations } from 'next-intl'

type PermissionsSectionProps = {
  permissions: string[]
}

export const PermissionsSection: React.FC<PermissionsSectionProps> = ({
  permissions
}: PermissionsSectionProps) => {
  const t_permissions = useTranslations('permissions')

  return (
    <Section subsection title={t_permissions('title')}>
      <Column>
        <Row className='overflow-x-auto w-full gap-2'>
          {permissions.map((permission, index) => (
            <Tag color='secondary' className='shrink-0' key={index}>
              {t_permissions(permission as any)}
            </Tag>
          ))}
        </Row>
      </Column>
    </Section>
  )
}
