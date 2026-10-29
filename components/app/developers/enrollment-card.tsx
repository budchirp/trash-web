'use client'

import type React from 'react'
import { useState } from 'react'

import { useUser } from '@/context/user'
import { handle } from '@/lib/handle'
import { useRouter } from '@/lib/i18n/navigation'
import { UserService } from '@/service/user'
import { useTranslations } from 'next-intl'

import { Box, BoxContent, Button, Column, Heading, Row, Text, toast } from '@trash-kit/ui'

type EnrollmentCardProps = {
  token: string
}

export const EnrollmentCard: React.FC<EnrollmentCardProps> = ({
  token
}: EnrollmentCardProps): React.ReactNode => {
  const t = useTranslations('developers.gate')
  const t_common = useTranslations('common')

  const { user, setUser } = useUser()
  const router = useRouter()

  const [isJoining, setIsJoining] = useState(false)

  const join = async () => {
    if (isJoining) return

    setIsJoining(true)

    const response = await UserService.updateProfile({ dev: true }, token)

    setIsJoining(false)

    if (handle(response)) return

    if (user) {
      setUser({ ...user, profile: { ...user.profile, dev: true } })
    }

    router.refresh()

    toast(t('joined'))
  }

  return (
    <Box color='secondary'>
      <BoxContent>
        <Column className='gap-4'>
          <Heading size='h3'>{t('title')}</Heading>

          <Text className='text-content-tertiary'>{t('description')}</Text>

          <Row className='w-full justify-end'>
            <Button disabled={isJoining} loading={isJoining} onClick={() => void join()}>
              {isJoining ? t_common('loading') : t_common('submit')}
            </Button>
          </Row>
        </Column>
      </BoxContent>
    </Box>
  )
}
