import type React from 'react'

import { requireDeveloper } from '@/lib/auth'

import { LINKS } from '@/lib/link'
import { NewApplicationClientPage } from './page.client'

const Page: React.FC = async (): Promise<React.ReactNode> => {
  const { token } = await requireDeveloper(LINKS.developers.newApplication)

  return <NewApplicationClientPage token={token} />
}

export default Page
