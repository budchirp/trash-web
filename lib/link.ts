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
    overview: '/developers/overview',
    applications: '/developers/applications',
    newApplication: '/developers/applications/new',
    application: (id: string): string => `/developers/applications/${encodeURIComponent(id)}`,
    editApplication: (id: string): string => `/developers/applications/${encodeURIComponent(id)}/edit`
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

type Translate = (...args: any[]) => string

export const getUserMenuLinks = (t: Translate, user: User): NavLink[] => [
  {
    label: t('profile.title'),
    url: LINKS.user.profile(user.username)
  },
  {
    label: t('settings.title'),
    url: LINKS.settings.root
  }
]

export const getDesktopNavLinks = (t: Translate, user: User | null, isHome: boolean): NavLink[] => {
  if (user) {
    return [
      {
        label: t('dashboard.title'),
        url: LINKS.dashboard
      },
      {
        label: t('developers.title'),
        url: LINKS.developers.root
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

export const getDrawerNavLinks = (t: Translate, user: User | null, isHome: boolean): NavLink[] => {
  if (!user) return getDesktopNavLinks(t, null, isHome)

  return [
    {
      label: t('dashboard.title'),
      url: LINKS.dashboard
    },
    {
      label: t('developers.title'),
      url: LINKS.developers.root
    },
    ...getUserMenuLinks(t, user)
  ]
}

export const getSettingsLinks = (t: Translate): NavLink[] => [
  {
    label: t('settings.account.title'),
    url: LINKS.settings.account
  },
  {
    label: t('settings.security.title'),
    url: LINKS.settings.security
  }
]

export const getDevelopersLinks = (t: Translate): NavLink[] => [
  {
    label: t('developers.overview.title'),
    url: LINKS.developers.overview
  },
  {
    label: t('developers.applications.title'),
    url: LINKS.developers.applications
  }
]
