'use client'

import { Center, Column, Heading, Section } from '@trash-kit/ui'
import { useUser } from '@/context/user'
import { ProfileAvatar } from '@/components/app/user/profile-avatar'
import { SettingsLinksSection } from './links-section'

export const SidebarSection = () => {
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
        <SettingsLinksSection />
      </Section>
    </Column>
  )
}
