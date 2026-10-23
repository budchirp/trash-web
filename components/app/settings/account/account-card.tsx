'use client'

import type React from 'react'

import { useTranslations } from 'next-intl'

import { Avatar, Box, BoxContent, Button, Column, Heading, Row } from '@trash-kit/ui'

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

  const name = user.profile?.name?.trim() || user.username

  return (
    <Box>
      <BoxContent className='flex-row justify-between gap-4'>
        <Row className='gap-3'>
          <Avatar name={name} size='lg' src={user.profile?.picture ?? undefined} />

          <Column>
            <Heading className='truncate' size='h3'>
              {name}
            </Heading>
            <Heading size='h4' className='text-content-tertiary truncate'>
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
