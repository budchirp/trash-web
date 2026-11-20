'use client'

import { Center, Column, Heading, Section } from '@trash-kit/ui'
import { useUser } from '@/context/user'
import { ProfileAvatar } from '@/components/app/user/profile-avatar'
import { useTranslations } from 'next-intl'
import { SelectableLinks } from '@/components/link'
import { getSecurityLinks, getSettingsLinks } from '@/lib/link'

export const SidebarSection = () => {
  const t = useTranslations()

  const { user } = useUser()

  const name = user?.profile?.name ?? user?.username

  return (
    <Column className='gap-4'>
      <Section
        title={
          <Center className='w-full gap-1'>
            <ProfileAvatar name={name} src={user?.profile?.picture?.url} className='size-24' />

            <Heading size='h3'>{name}</Heading>
          </Center>
        }
      >
        <Column className='w-full gap-2'>
          <SelectableLinks box links={getSettingsLinks(t)} />

          <Column className='w-full border-l border-outline pl-4'>
            <SelectableLinks box links={getSecurityLinks(t)} />
          </Column>
        </Column>
      </Section>
    </Column>
  )
}
