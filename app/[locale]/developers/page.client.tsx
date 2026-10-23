'use client'

import type React from 'react'
import { useState } from 'react'

import { useUser } from '@/context/user'
import { handle } from '@/lib/handle'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/lib/i18n/navigation'
import { LINKS } from '@/lib/link'
import { UserService } from '@/service/user'
import { useTranslations } from 'next-intl'

import {
  Box,
  BoxContent,
  Button,
  Column,
  Container,
  Heading,
  Row,
  Section,
  Text,
  toast
} from '@trash-kit/ui'

import type { User } from '@/types/api/user'

type DevelopersClientPageProps = {
  token: string

  user: User
}

export const DevelopersClientPage: React.FC<DevelopersClientPageProps> = ({
  token,
  user
}: DevelopersClientPageProps): React.ReactNode => {
  const t = useTranslations('developers')
  const t_common = useTranslations('common')

  const { user: currentUser, setUser } = useUser()
  const [isJoining, setIsJoining] = useState(false)

  const isDev = (currentUser ?? user).profile?.dev ?? false

  const join = async () => {
    if (isJoining) return

    setIsJoining(true)

    const response = await UserService.updateProfile({ dev: true }, token)

    setIsJoining(false)

    if (handle(response)) return

    if (currentUser) {
      setUser({ ...currentUser, profile: { ...currentUser.profile, dev: true } })
    }

    toast(t('gate.joined'))
  }

  return (
    <Container className='max-w-lg!'>
      <Section title={t('title')}>
        {isDev ? (
          <Link href={LINKS.developers.applications}>
            <Button className='gap-2'>
              {t('go_to_applications')}
              <ArrowRight className='size-4' />
            </Button>
          </Link>
        ) : (
          <Box color='secondary'>
            <BoxContent>
              <Column className='gap-4'>
                <Heading size='h3'>{t('gate.title')}</Heading>

                <Text className='text-content-tertiary'>{t('gate.description')}</Text>

                <Row className='w-full justify-end'>
                  <Button disabled={isJoining} loading={isJoining} onClick={() => void join()}>
                    {isJoining ? t_common('loading') : t_common('submit')}
                  </Button>
                </Row>
              </Column>
            </BoxContent>
          </Box>
        )}
      </Section>
    </Container>
  )
}
