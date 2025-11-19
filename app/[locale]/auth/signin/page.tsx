import type React from 'react'

import { SignInClientPage } from '@/app/[locale]/auth/signin/page.client'
import { getCookies } from 'next-client-cookies/server'
import { CONSTANTS } from '@/lib/constants'
import { publicRoute } from '@/lib/auth'

import { Column } from '@trash-kit/ui'

const SignInPage: React.FC = async (): Promise<React.ReactNode> => {
  const cookies = await getCookies()
  const token = cookies.get(CONSTANTS.COOKIES.TOKEN)

  await publicRoute(token)

  return (
    <Column padding='page'>
      <SignInClientPage />
    </Column>
  )
}

export default SignInPage
