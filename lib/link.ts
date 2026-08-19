import type { _Translator as Translator } from 'next-intl'

import type { User } from '@/types/api/user'

export const LINKS = {
  home: '/',
  onboarding: '/onboarding',
  auth: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  },
  help: {
    terms: '/help/legal/terms-of-service',
    privacy: '/help/legal/privacy-policy'
  },
  settings: {
    root: '/settings',
    account: '/settings/account',
    security: '/settings/security'
  },
  dashboard: '/home',
  developers: {
    root: '/developers',
    applications: '/developers/applications',
    newApplication: '/developers/applications/new'
  },
  user: {
    profile: (username: string): string => `/user/${encodeURIComponent(username)}`,
    profileEdit: (username: string): string => `/user/${encodeURIComponent(username)}/edit`
  }
} as const

export type NavLink = {
  label: string
  url: string
}

export const getUserMenuLinks = (t: Translator, user: User): NavLink[] => [
  {
    label: t('profile.title'),
    url: LINKS.user.profile(user.username)
  },
  {
    label: t('settings.title'),
    url: LINKS.settings.root
  }
]

export const getDesktopNavLinks = (
  t: Translator,
  user: User | null,
  isHome: boolean
): NavLink[] => {
  if (user) {
    return [
      {
        label: t('dashboard.title'),
        url: LINKS.dashboard
      }
    ]
  }

  if (isHome) return []

  return [
    {
      label: t('common.home'),
      url: LINKS.home
    }
  ]
}

export const getDrawerNavLinks = (t: Translator, user: User | null, isHome: boolean): NavLink[] => {
  if (!user) return getDesktopNavLinks(t, null, isHome)

  return [
    {
      label: t('dashboard.title'),
      url: LINKS.dashboard
    },
    ...getUserMenuLinks(t, user)
  ]
}

export const getSettingsLinks = (t: Translator): NavLink[] => [
  {
    label: t('settings.account.title'),
    url: LINKS.settings.account
  },
  {
    label: t('settings.security.title'),
    url: LINKS.settings.security
  }
]
