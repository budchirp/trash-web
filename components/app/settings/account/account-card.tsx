'use client'

import type React from 'react'

import { useTranslations } from 'next-intl'
import { Avatar } from '@/components/app/settings/avatar'

import { Box, BoxContent, Button, Column, Heading, Row, Text } from '@trash-kit/ui'

import type { User } from '@/types/api/user'

type AccountCardProps = {
  user: User
  active?: boolean
  onClick?: (() => void) | null
}

export const AccountCard: React.FC<AccountCardProps> = ({
  user,
  active = true,
  onClick = null
}: AccountCardProps): React.ReactNode => {
  const t = useTranslations()

  return (
    <Box>
      <BoxContent className='flex-row justify-between gap-4'>
        <Row className='gap-3'>
          <Avatar showUsername={false} src={user.profile?.picture || ''} className='size-12' />

          <Column>
            <Heading className='truncate' size='h3'>
              {user.profile?.name?.trim() || user.username}
            </Heading>
            <Heading size='h4' className='text-tertiary truncate'>
              {user.email}
            </Heading>
          </Column>
        </Row>

        {onClick != null && (
          <Row className='items-center'>
            <Button color={active ? 'accent' : 'secondary'} onClick={onClick as any}>
              {t(active ? 'common.continue' : 'auth.account.switch_account')}
            </Button>
          </Row>
        )}
      </BoxContent>
    </Box>
  )
}
