import type React from 'react'

import { ConnectionService } from '@/service/connection'
import { SessionService } from '@/service/session'
import { getTranslations } from 'next-intl/server'
import { _authtenticated } from '@/lib/auth'
import { SessionBox } from './session-box'

import { Box, BoxContent, Column, Heading, Section, Text } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'
import { ConnectionBox } from './connection-box'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const jwt = await _authtenticated()

  const { locale } = await params
  const t = await getTranslations({
    namespace: 'settings',
    locale
  })

  const { data: sessions } = await SessionService.getAll({ jwt })
  const { data: connections } = await ConnectionService.getAll({ jwt })

  return (
    <Column className='gap-4'>
      <Section title={t('session.title')} description={t('session.description')}>
        <Column className='gap-4'>
          {sessions?.map((session, index) => (
            <SessionBox session={session} key={index} jwt={jwt} />
          ))}
        </Column>
      </Section>

      <Section title={t('connection.title')} description={t('connection.description')}>
        <Column className='gap-4'>
          {connections?.map((connection, index) => (
            <ConnectionBox connection={connection} key={index} jwt={jwt} />
          ))}
        </Column>
      </Section>
    </Column>
  )
}

export default Page
